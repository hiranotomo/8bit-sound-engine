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
  private unlocked = false

  constructor(options: EngineOptions = {}) {
    this.options = options
    this.setupAutoUnlock()
  }

  /**
   * Auto-unlock audio on first user gesture.
   * Based on howler.js, Phaser 3.88, and unmute.js best practices.
   * CRITICAL: use touchend, NOT touchstart — touchstart does NOT satisfy
   * iOS Safari's user activation requirement.
   */
  private setupAutoUnlock(): void {
    const events = ['touchend', 'click', 'keydown', 'mousedown']
    const unlock = () => {
      this.init()
      this.unlockAudio()
      if (this.unlocked) {
        events.forEach(e => document.removeEventListener(e, unlock, true))
      }
    }
    // Capture phase (same as howler.js)
    events.forEach(e => document.addEventListener(e, unlock, true))

    // Handle iOS "interrupted" state on background/foreground
    document.addEventListener('visibilitychange', () => {
      if (document.hidden || !this.ctx || this.ctx.state === 'closed') return
      // Phaser's fix for iOS 17+: suspend then resume with delay
      setTimeout(() => {
        if (this.ctx && this.ctx.state !== 'running') {
          this.ctx.suspend().then(() => this.ctx!.resume())
        }
      }, 100)
    })

    // Apple's visibilitychange is unreliable — also listen to focus (from unmute.js)
    window.addEventListener('focus', () => {
      if (this.ctx && this.ctx.state !== 'running' && this.ctx.state !== 'closed') {
        this.ctx.resume().catch(() => {})
      }
    })
  }

  /** Play silent buffer + resume — both needed for iOS unlock (from howler.js) */
  private unlockAudio(): void {
    if (this.unlocked || !this.ctx) return
    // Play a silent buffer (warms the context on older iOS)
    const buffer = this.ctx.createBuffer(1, 1, 22050)
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    source.connect(this.ctx.destination)
    source.start(0)
    source.onended = () => {
      source.disconnect(0)
      if (this.ctx && this.ctx.state === 'running') {
        this.unlocked = true
      }
    }
    // Resume — this is the key call on modern iOS
    if (this.ctx.state !== 'running') {
      this.ctx.resume().then(() => {
        this.unlocked = true
      }).catch(() => {})
    } else {
      this.unlocked = true
    }
  }

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

    // Monitor statechange to auto-recover (from unmute.js)
    this.ctx.addEventListener('statechange', () => {
      if (this.ctx && this.ctx.state !== 'running' && this.ctx.state !== 'closed') {
        this.ctx.resume().catch(() => {})
      }
    })
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

  /** Resume AudioContext — call from user gesture handlers */
  async resume(): Promise<void> {
    this.init()
    this.unlockAudio()
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
  }
}

export function createSoundEngine(options?: EngineOptions): SoundEngine {
  return new SoundEngine(options)
}
