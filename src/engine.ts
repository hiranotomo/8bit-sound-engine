import { BGMPlayer } from './bgm-player'
import { SEPlayer } from './se-player'
import { createReverb } from './reverb'

export interface EngineOptions {
  reverb?: boolean | { duration?: number; decay?: number; mix?: number }
}

export class SoundEngine {
  readonly bgm: BGMPlayer
  readonly se: SEPlayer
  private ctx: AudioContext
  private masterGain: GainNode
  private reverbNode: ConvolverNode | null = null
  private reverbGain: GainNode | null = null
  private dryGain: GainNode | null = null

  constructor(options: EngineOptions = {}) {
    // Use webkitAudioContext for older iOS Safari
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    this.ctx = new AudioCtx()
    this.masterGain = this.ctx.createGain()

    // Set up reverb if enabled
    const reverbOpts = options.reverb
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

    // Players output to masterGain instead of destination
    this.bgm = new BGMPlayer(this.ctx, this.masterGain)
    this.se = new SEPlayer(this.ctx, this.masterGain)
  }

  /** Set reverb wet/dry mix (0 = fully dry, 1 = fully wet) */
  setReverbMix(mix: number): void {
    if (this.dryGain && this.reverbGain) {
      this.dryGain.gain.value = 1 - mix
      this.reverbGain.gain.value = mix
    }
  }

  /** Resume AudioContext — MUST be called from a user gesture on iOS */
  async resume(): Promise<void> {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
    // iOS Safari workaround: play a silent buffer to "unlock" audio
    if (this.ctx.state === 'running') return
    const buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate)
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    source.connect(this.ctx.destination)
    source.start(0)
    await this.ctx.resume()
  }
}

export function createSoundEngine(options?: EngineOptions): SoundEngine {
  return new SoundEngine(options)
}
