// src/bgm-player.ts
import { BGMDefinition } from './types'
import { Synth } from './synth'
import { noteToFrequency } from './utils/note'
import { durationToSeconds } from './utils/timing'
import { createNoiseNode } from './noise'

export class BGMPlayer {
  private ctx: AudioContext
  private currentSynths: Synth[] = []
  private isPlaying = false
  private loopTimeoutId: number | null = null
  private masterGain: GainNode

  constructor(ctx: AudioContext) {
    this.ctx = ctx
    this.masterGain = ctx.createGain()
    this.masterGain.connect(ctx.destination)
  }

  play(definition: BGMDefinition): void {
    this.stopImmediate()
    this.isPlaying = true
    this.masterGain.gain.value = 1
    this.scheduleTrack(definition)
  }

  changeTo(definition: BGMDefinition, options?: { fade?: number }): void {
    const fadeMs = options?.fade ?? 300
    const fadeSec = fadeMs / 1000
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeSec)
    setTimeout(() => {
      this.stopImmediate()
      this.masterGain.gain.value = 1
      this.isPlaying = true
      this.scheduleTrack(definition)
    }, fadeMs)
  }

  stop(options?: { fade?: number }): void {
    const fadeMs = options?.fade ?? 0
    if (fadeMs > 0) {
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
    this.currentSynths = []
  }

  private scheduleTrack(def: BGMDefinition): void {
    let maxDuration = 0
    const startTime = this.ctx.currentTime + 0.05

    for (const ch of def.channels) {
      const synth = new Synth(this.ctx, ch.wave, ch.volume ?? 0.5)
      synth.output.disconnect()
      synth.output.connect(this.masterGain)
      this.currentSynths.push(synth)

      let time = startTime
      for (const note of ch.notes) {
        const dur = durationToSeconds(note.duration, def.bpm)
        const freq = noteToFrequency(note.pitch)
        if (ch.wave === 'noise') {
          if (freq > 0) {
            const noise = createNoiseNode(this.ctx, dur, time)
            const gain = this.ctx.createGain()
            gain.gain.value = ch.volume ?? 0.5
            noise.connect(gain)
            gain.connect(this.masterGain)
          }
        } else {
          const oscType = ch.wave === 'square' ? 'square' : 'triangle'
          synth.playNote(freq, time, dur * 0.9, oscType)
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
