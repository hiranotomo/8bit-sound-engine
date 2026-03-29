// src/synth.ts
import { WaveType } from './types'

export class Synth {
  private ctx: AudioContext
  private gainNode: GainNode

  constructor(ctx: AudioContext, wave: WaveType, volume: number = 1.0) {
    this.ctx = ctx
    this.gainNode = ctx.createGain()
    this.gainNode.gain.value = volume
    this.gainNode.connect(ctx.destination)
  }

  playNote(frequency: number, startTime: number, duration: number, wave: OscillatorType): void {
    if (frequency === 0) return // rest
    const osc = this.ctx.createOscillator()
    osc.type = wave
    osc.frequency.value = frequency
    osc.connect(this.gainNode)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  setVolume(value: number, rampTime: number = 0): void {
    if (rampTime > 0) {
      this.gainNode.gain.linearRampToValueAtTime(value, this.ctx.currentTime + rampTime)
    } else {
      this.gainNode.gain.value = value
    }
  }

  get output(): GainNode {
    return this.gainNode
  }
}
