import { BGMDefinition } from './types'
import { noteToFrequency } from './utils/note'
import { durationToSeconds } from './utils/timing'

export class BGMPlayer {
  private ctx: AudioContext
  private scheduledNodes: AudioNode[] = []
  private isPlaying = false
  private loopTimeoutId: number | null = null
  private masterGain: GainNode

  constructor(ctx: AudioContext, output?: AudioNode) {
    this.ctx = ctx
    this.masterGain = ctx.createGain()
    this.masterGain.connect(output ?? ctx.destination)
  }

  play(definition: BGMDefinition): void {
    this.stopImmediate()
    this.isPlaying = true
    this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime)
    this.scheduleTrack(definition)
  }

  changeTo(definition: BGMDefinition, options?: { fade?: number }): void {
    const fadeMs = options?.fade ?? 300
    const fadeSec = fadeMs / 1000
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime)
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeSec)
    setTimeout(() => {
      this.stopImmediate()
      this.isPlaying = true
      this.scheduleTrack(definition)
    }, fadeMs)
  }

  stop(options?: { fade?: number }): void {
    const fadeMs = options?.fade ?? 0
    if (fadeMs > 0) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime)
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeMs / 1000)
      setTimeout(() => this.stopImmediate(), fadeMs)
    } else {
      this.stopImmediate()
    }
  }

  private stopImmediate(): void {
    this.isPlaying = false
    if (this.loopTimeoutId !== null) {
      clearTimeout(this.loopTimeoutId)
      this.loopTimeoutId = null
    }
    // Cancel any pending gain automation (ramps) so they don't interfere
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime)
    // Disconnect all scheduled nodes to silence them immediately
    for (const node of this.scheduledNodes) {
      try {
        node.disconnect()
      } catch (_) { /* already disconnected */ }
    }
    this.scheduledNodes = []
  }

  private scheduleTrack(def: BGMDefinition): void {
    let maxDuration = 0
    const startTime = this.ctx.currentTime + 0.05

    for (const ch of def.channels) {
      // Skip noise channels in BGM
      if (ch.wave === 'noise') continue

      const oscType: OscillatorType = ch.wave as OscillatorType
      const volume = ch.volume ?? 0.5

      const channelGain = this.ctx.createGain()
      channelGain.gain.value = volume

      // Stereo panning per channel
      const pan = ch.pan ?? 0
      if (pan !== 0) {
        const panner = this.ctx.createStereoPanner()
        panner.pan.value = pan
        channelGain.connect(panner)
        panner.connect(this.masterGain)
        this.scheduledNodes.push(panner)
      } else {
        channelGain.connect(this.masterGain)
      }
      this.scheduledNodes.push(channelGain)

      let time = startTime
      for (const note of ch.notes) {
        const dur = durationToSeconds(note.duration, def.bpm)
        const freq = noteToFrequency(note.pitch)
        if (freq > 0) {
          const osc = this.ctx.createOscillator()
          osc.type = oscType
          osc.frequency.value = freq
          osc.connect(channelGain)
          osc.start(time)
          osc.stop(time + dur * 0.9)
          this.scheduledNodes.push(osc)
        }
        time += dur
      }
      const channelDuration = time - startTime
      if (channelDuration > maxDuration) maxDuration = channelDuration
    }

    if (def.loop && this.isPlaying) {
      this.loopTimeoutId = window.setTimeout(() => {
        if (this.isPlaying) this.scheduleTrack(def)
      }, maxDuration * 1000) as unknown as number
    }
  }
}
