import { SEDefinition } from './types'
import { SE_PRESETS } from './presets/se'
import { noteToFrequency } from './utils/note'
import { durationToSeconds } from './utils/timing'
import { createNoiseNode } from './noise'

const DEFAULT_BPM = 240

export class SEPlayer {
  private ctx: AudioContext
  private output: AudioNode

  constructor(ctx: AudioContext, output?: AudioNode) {
    this.ctx = ctx
    this.output = output ?? ctx.destination
  }

  play(nameOrDef: string | SEDefinition, options?: { pitch?: number }): void {
    const def = typeof nameOrDef === 'string' ? SE_PRESETS[nameOrDef] : nameOrDef
    if (!def) throw new Error(`Unknown SE preset: ${nameOrDef}`)

    const pitchMult = options?.pitch ?? 1.0
    const startTime = this.ctx.currentTime
    const gain = this.ctx.createGain()
    gain.gain.value = def.volume ?? 0.5
    gain.connect(this.output)

    let time = startTime
    for (const note of def.notes) {
      const dur = durationToSeconds(note.duration, DEFAULT_BPM)
      const freq = noteToFrequency(note.pitch) * pitchMult

      if (def.wave === 'noise') {
        if (freq > 0) {
          const noise = createNoiseNode(this.ctx, dur, time)
          noise.connect(gain)
        }
      } else {
        if (freq > 0) {
          const osc = this.ctx.createOscillator()
          osc.type = def.wave as OscillatorType
          osc.frequency.value = freq
          osc.connect(gain)
          osc.start(time)
          osc.stop(time + dur * 0.9)
        }
      }
      time += dur
    }
  }
}
