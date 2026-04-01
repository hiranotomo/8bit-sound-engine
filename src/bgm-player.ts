import { BGMDefinition } from './types'
import { noteToFrequency } from './utils/note'
import { durationToSeconds } from './utils/timing'
import { isCustomWave, getCustomWave } from './waves'

export class BGMPlayer {
  private ctx: AudioContext
  private scheduledNodes: AudioNode[] = []
  private isPlaying = false
  private loopTimeoutId: number | null = null
  private masterGain: GainNode
  private channelGains: GainNode[] = []
  private channelPanners: StereoPannerNode[] = []
  private channelVolumes: number[] = []
  private channelMuted: boolean[] = []
  private currentDefinition: BGMDefinition | null = null

  constructor(ctx: AudioContext, output?: AudioNode) {
    this.ctx = ctx
    this.masterGain = ctx.createGain()
    this.masterGain.connect(output ?? ctx.destination)
  }

  play(definition: BGMDefinition): void {
    this.stopImmediate()
    this.currentDefinition = definition
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
      this.currentDefinition = definition
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

  /** Mute/unmute a channel by index with a short fade */
  setChannelMute(channelIndex: number, muted: boolean): void {
    this.channelMuted[channelIndex] = muted
    const gain = this.channelGains[channelIndex]
    if (!gain) return
    const target = muted ? 0 : this.channelVolumes[channelIndex] ?? 0.5
    gain.gain.cancelScheduledValues(this.ctx.currentTime)
    gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.15)
  }

  /** Toggle mute on a channel, returns new muted state */
  toggleChannel(channelIndex: number): boolean {
    const muted = !this.channelMuted[channelIndex]
    this.setChannelMute(channelIndex, muted)
    return muted
  }

  /** Set pan for a specific channel. -1 = left, 1 = right */
  setChannelPan(channelIndex: number, pan: number): void {
    if (this.channelPanners[channelIndex]) {
      this.channelPanners[channelIndex].pan.value = Math.max(-1, Math.min(1, pan))
    }
  }

  /** Get number of active (non-noise) channels */
  get channelCount(): number {
    return this.channelGains.length
  }

  /** Apply a named variation from the current BGM's variations list */
  setVariation(name: string): void {
    if (!this.currentDefinition?.variations) return
    const v = this.currentDefinition.variations.find(v => v.name === name)
    if (!v) return
    for (let i = 0; i < v.layers.length; i++) {
      this.setChannelMute(i, !v.layers[i])
    }
  }

  private stopImmediate(): void {
    this.currentDefinition = null
    this.isPlaying = false
    if (this.loopTimeoutId !== null) {
      clearTimeout(this.loopTimeoutId)
      this.loopTimeoutId = null
    }
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime)
    for (const node of this.scheduledNodes) {
      try { node.disconnect() } catch (_) { /* already disconnected */ }
    }
    this.scheduledNodes = []
    this.channelGains = []
    this.channelPanners = []
    this.channelVolumes = []
    this.channelMuted = []
  }

  /** Clear scheduled audio nodes but preserve mute state for loop */
  private clearScheduledNodes(): void {
    if (this.loopTimeoutId !== null) {
      clearTimeout(this.loopTimeoutId)
      this.loopTimeoutId = null
    }
    for (const node of this.scheduledNodes) {
      try { node.disconnect() } catch (_) { /* already disconnected */ }
    }
    this.scheduledNodes = []
    this.channelGains = []
    this.channelPanners = []
    this.channelVolumes = []
    // NOTE: channelMuted is NOT cleared — preserved across loops
  }

  private scheduleTrack(def: BGMDefinition): void {
    // On loop, clear nodes but keep mute state
    if (this.channelGains.length > 0) {
      this.clearScheduledNodes()
    }

    let maxDuration = 0
    const startTime = this.ctx.currentTime + 0.05
    let chIndex = 0

    for (const ch of def.channels) {
      if (ch.wave === 'noise') continue

      const useCustom = isCustomWave(ch.wave)
      const oscType: OscillatorType = useCustom ? 'sine' : ch.wave as OscillatorType
      const customWave = useCustom ? getCustomWave(this.ctx, ch.wave) : null
      const volume = ch.volume ?? 0.5
      const isMuted = this.channelMuted[chIndex] ?? false

      const channelGain = this.ctx.createGain()
      channelGain.gain.value = isMuted ? 0 : volume

      const panner = this.ctx.createStereoPanner()
      panner.pan.value = ch.pan ?? 0
      channelGain.connect(panner)
      panner.connect(this.masterGain)

      this.channelGains.push(channelGain)
      this.channelPanners.push(panner)
      this.channelVolumes.push(volume)
      if (this.channelMuted.length <= chIndex) this.channelMuted.push(false)
      this.scheduledNodes.push(panner)
      this.scheduledNodes.push(channelGain)

      const attack = ch.attack ?? 0.01
      const release = ch.release ?? 0.05
      const detuneVal = ch.detune ?? 0

      let time = startTime
      for (const note of ch.notes) {
        const dur = durationToSeconds(note.duration, def.bpm)
        const freq = noteToFrequency(note.pitch)
        if (freq > 0) {
          // Per-note gain envelope (attack/release)
          const noteGain = this.ctx.createGain()
          noteGain.gain.setValueAtTime(0, time)
          noteGain.gain.linearRampToValueAtTime(1, time + Math.min(attack, dur * 0.3))
          const releaseStart = time + dur * 0.85 - release
          if (releaseStart > time + attack) {
            noteGain.gain.setValueAtTime(1, releaseStart)
          }
          noteGain.gain.linearRampToValueAtTime(0, time + dur * 0.9)
          noteGain.connect(channelGain)
          this.scheduledNodes.push(noteGain)

          // Primary oscillator
          const osc = this.ctx.createOscillator()
          if (customWave) {
            osc.setPeriodicWave(customWave)
          } else {
            osc.type = oscType
          }
          osc.frequency.value = freq
          osc.connect(noteGain)
          osc.start(time)
          osc.stop(time + dur * 0.95)
          this.scheduledNodes.push(osc)

          // Detuned 2nd oscillator for chorus/thickness effect
          if (detuneVal > 0) {
            const osc2 = this.ctx.createOscillator()
            if (customWave) {
              osc2.setPeriodicWave(customWave)
            } else {
              osc2.type = oscType
            }
            osc2.frequency.value = freq
            osc2.detune.value = detuneVal
            osc2.connect(noteGain)
            osc2.start(time)
            osc2.stop(time + dur * 0.95)
            this.scheduledNodes.push(osc2)
          }
        }
        time += dur
      }
      const channelDuration = time - startTime
      if (channelDuration > maxDuration) maxDuration = channelDuration
      chIndex++
    }

    if (def.loop && this.isPlaying) {
      this.loopTimeoutId = window.setTimeout(() => {
        if (this.isPlaying) this.scheduleTrack(def)
      }, maxDuration * 1000) as unknown as number
    }
  }
}
