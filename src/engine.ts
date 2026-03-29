import { BGMPlayer } from './bgm-player'
import { SEPlayer } from './se-player'

export class SoundEngine {
  readonly bgm: BGMPlayer
  readonly se: SEPlayer
  private ctx: AudioContext

  constructor() {
    this.ctx = new AudioContext()
    this.bgm = new BGMPlayer(this.ctx)
    this.se = new SEPlayer(this.ctx)
  }

  resume(): Promise<void> {
    return this.ctx.resume()
  }
}

export function createSoundEngine(): SoundEngine {
  return new SoundEngine()
}
