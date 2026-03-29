import { BGMPlayer } from './bgm-player'
import { SEPlayer } from './se-player'
import { createReverb } from './reverb'

export interface EngineOptions {
  reverb?: boolean | { duration?: number; decay?: number; mix?: number }
}

export class SoundEngine {
  private _bgm: BGMPlayer | null = null
  private _se: SEPlayer | null = null
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private reverbNode: ConvolverNode | null = null
  private reverbGain: GainNode | null = null
  private dryGain: GainNode | null = null
  private options: EngineOptions
  private initialized = false

  constructor(options: EngineOptions = {}) {
    this.options = options
  }

  /** Initialize audio context — called automatically on first resume() */
  private init(): void {
    if (this.initialized) return
    this.initialized = true

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    this.ctx = new AudioCtx()
    this.masterGain = this.ctx.createGain()

    const reverbOpts = this.options.reverb
    if (reverbOpts) {
      const config = typeof reverbOpts === 'object' ? reverbOpts : {}
      const mix = config.mix ?? 0.25

      this.dryGain = this.ctx.createGain()
      this.dryGain.gain.value = 1 - mix
      this.dryGain.connect(this.ctx.destination)

      this.reverbNode = createReverb(this.ctx, config.duration ?? 1.5, config.decay ?? 2.0)
      this.reverbGain = this.ctx.createGain()
      this.reverbGain.gain.value = mix
      this.reverbNode.connect(this.reverbGain)
      this.reverbGain.connect(this.ctx.destination)

      this.masterGain.connect(this.dryGain)
      this.masterGain.connect(this.reverbNode)
    } else {
      this.masterGain.connect(this.ctx.destination)
    }

    this._bgm = new BGMPlayer(this.ctx, this.masterGain)
    this._se = new SEPlayer(this.ctx, this.masterGain)
  }

  get bgm(): BGMPlayer {
    this.init()
    return this._bgm!
  }

  get se(): SEPlayer {
    this.init()
    return this._se!
  }

  setReverbMix(mix: number): void {
    if (this.dryGain && this.reverbGain) {
      this.dryGain.gain.value = 1 - mix
      this.reverbGain.gain.value = mix
    }
  }

  /** Resume AudioContext — MUST be called from a user gesture on iOS */
  async resume(): Promise<void> {
    this.init()
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
  }
}

export function createSoundEngine(options?: EngineOptions): SoundEngine {
  return new SoundEngine(options)
}
