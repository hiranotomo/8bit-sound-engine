# 8bit Sound Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** ファミコン風の8bitサウンドをリアルタイム合成するWebライブラリと、ピクセルアート風デモページを作る

**Architecture:** Web Audio APIのOscillatorNode/GainNodeで矩形波・三角波・ノイズを合成する。BGMはJSON定義をスケジューラが読みリアルタイム再生、SEはワンショット再生。デモページはViteで配信し、CSS pixel artスタイルのUIで操作する。

**Tech Stack:** TypeScript, Web Audio API, Vite, Vitest

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/index.ts` (empty export)
- Create: `index.html` (demo entry)

**Step 1: Initialize project**

```bash
cd /Users/hirano/_MyDev/8bit
npm init -y
npm install -D typescript vite vitest
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2020", "DOM"]
  },
  "include": ["src"]
}
```

**Step 3: Create vite.config.ts**

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'EightBitSound',
      fileName: '8bit-sound-engine'
    }
  }
})
```

**Step 4: Create src/index.ts**

```ts
export {}
```

**Step 5: Create index.html (demo shell)**

Minimal HTML that imports the module.

**Step 6: Verify dev server starts**

Run: `npx vite --open`
Expected: Browser opens with blank page, no errors in console

**Step 7: Commit**

```bash
git init
git add -A
git commit -m "chore: initial project scaffolding with Vite + TypeScript"
```

---

### Task 2: Note & Timing Utilities

**Files:**
- Create: `src/utils/note.ts`
- Create: `src/utils/timing.ts`
- Create: `tests/utils/note.test.ts`
- Create: `tests/utils/timing.test.ts`

**Step 1: Write failing tests for note-to-frequency conversion**

```ts
// tests/utils/note.test.ts
import { describe, it, expect } from 'vitest'
import { noteToFrequency } from '../../src/utils/note'

describe('noteToFrequency', () => {
  it('converts A4 to 440Hz', () => {
    expect(noteToFrequency('A4')).toBeCloseTo(440)
  })
  it('converts C4 to ~261.63Hz', () => {
    expect(noteToFrequency('C4')).toBeCloseTo(261.63, 1)
  })
  it('returns 0 for null (rest)', () => {
    expect(noteToFrequency(null)).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/utils/note.test.ts`
Expected: FAIL

**Step 3: Implement noteToFrequency**

```ts
// src/utils/note.ts
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

export function noteToFrequency(note: string | null): number {
  if (note === null) return 0
  const match = note.match(/^([A-G]#?)(\d)$/)
  if (!match) throw new Error(`Invalid note: ${note}`)
  const [, name, octaveStr] = match
  const octave = parseInt(octaveStr)
  const semitone = NOTE_NAMES.indexOf(name)
  if (semitone === -1) throw new Error(`Invalid note name: ${name}`)
  const midiNote = (octave + 1) * 12 + semitone
  return 440 * Math.pow(2, (midiNote - 69) / 12)
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/utils/note.test.ts`
Expected: PASS

**Step 5: Write failing tests for duration-to-seconds conversion**

```ts
// tests/utils/timing.test.ts
import { describe, it, expect } from 'vitest'
import { durationToSeconds } from '../../src/utils/timing'

describe('durationToSeconds', () => {
  it('converts whole note at 120bpm to 2s', () => {
    expect(durationToSeconds('1n', 120)).toBeCloseTo(2.0)
  })
  it('converts quarter note at 120bpm to 0.5s', () => {
    expect(durationToSeconds('4n', 120)).toBeCloseTo(0.5)
  })
  it('converts 8th note at 120bpm to 0.25s', () => {
    expect(durationToSeconds('8n', 120)).toBeCloseTo(0.25)
  })
  it('converts 16th note at 140bpm', () => {
    expect(durationToSeconds('16n', 140)).toBeCloseTo(60 / 140 / 4)
  })
})
```

**Step 6: Implement durationToSeconds**

```ts
// src/utils/timing.ts
export function durationToSeconds(duration: string, bpm: number): number {
  const beatDuration = 60 / bpm
  const match = duration.match(/^(\d+)n$/)
  if (!match) throw new Error(`Invalid duration: ${duration}`)
  const divisor = parseInt(match[1])
  return (4 / divisor) * beatDuration
}
```

**Step 7: Run all tests**

Run: `npx vitest run`
Expected: All PASS

**Step 8: Commit**

```bash
git add src/utils tests/utils
git commit -m "feat: add note-to-frequency and duration-to-seconds utilities"
```

---

### Task 3: Synth (oscillator wrapper)

**Files:**
- Create: `src/synth.ts`
- Create: `tests/synth.test.ts`

**Step 1: Write failing test for Synth**

```ts
// tests/synth.test.ts
import { describe, it, expect } from 'vitest'
import { Synth } from '../src/synth'

describe('Synth', () => {
  it('creates with default AudioContext', () => {
    const ctx = new AudioContext()
    const synth = new Synth(ctx, { wave: 'square' })
    expect(synth).toBeDefined()
    ctx.close()
  })
})
```

Note: Vitest runs in Node, no AudioContext. Configure vitest with `environment: 'jsdom'` or use `happy-dom`. Add `vitest.config.ts` with `environment: 'happy-dom'`. Install `happy-dom`.

Actually — Web Audio API is not available in jsdom/happy-dom. For synth tests, we test only non-AudioContext logic in unit tests and verify audio output manually via demo page.

**Step 1 (revised): Create Synth class with types**

```ts
// src/types.ts
export type WaveType = 'square' | 'triangle' | 'noise'

export interface NoteEvent {
  pitch: string | null
  duration: string
}

export interface ChannelDefinition {
  wave: WaveType
  duty?: number
  volume?: number
  notes: NoteEvent[]
}

export interface BGMDefinition {
  bpm: number
  loop?: boolean
  channels: ChannelDefinition[]
}

export interface SEDefinition {
  wave: WaveType
  notes: NoteEvent[]
  volume?: number
}
```

```ts
// src/synth.ts
import { WaveType } from './types'
import { noteToFrequency } from './utils/note'

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
    osc.type = wave === 'noise' ? 'square' : wave // noise handled separately
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
```

**Step 2: Create NoiseNode for percussion**

```ts
// src/noise.ts
export function createNoiseNode(ctx: AudioContext, duration: number, startTime: number): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.start(startTime)
  source.stop(startTime + duration)
  return source
}
```

**Step 3: Commit**

```bash
git add src/types.ts src/synth.ts src/noise.ts
git commit -m "feat: add Synth class and noise generator"
```

---

### Task 4: BGMPlayer

**Files:**
- Create: `src/bgm-player.ts`

**Step 1: Implement BGMPlayer**

```ts
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
    // Synths will naturally stop as oscillators have scheduled stop times
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
```

**Step 2: Commit**

```bash
git add src/bgm-player.ts
git commit -m "feat: add BGMPlayer with loop and fade transition support"
```

---

### Task 5: SEPlayer with Presets

**Files:**
- Create: `src/se-player.ts`
- Create: `src/presets/se.ts`

**Step 1: Define SE presets**

```ts
// src/presets/se.ts
import { SEDefinition } from '../types'

export const SE_PRESETS: Record<string, SEDefinition> = {
  jump: {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'C4', duration: '32n' },
      { pitch: 'E4', duration: '32n' },
      { pitch: 'G4', duration: '32n' },
      { pitch: 'C5', duration: '16n' },
    ]
  },
  coin: {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'E5', duration: '16n' },
      { pitch: 'B5', duration: '8n' },
    ]
  },
  damage: {
    wave: 'noise',
    volume: 0.6,
    notes: [
      { pitch: 'C2', duration: '8n' },
      { pitch: 'C1', duration: '8n' },
    ]
  },
  powerup: {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'C4', duration: '32n' },
      { pitch: 'D4', duration: '32n' },
      { pitch: 'E4', duration: '32n' },
      { pitch: 'F4', duration: '32n' },
      { pitch: 'G4', duration: '32n' },
      { pitch: 'A4', duration: '32n' },
      { pitch: 'B4', duration: '32n' },
      { pitch: 'C5', duration: '16n' },
    ]
  },
  gameover: {
    wave: 'triangle',
    volume: 0.7,
    notes: [
      { pitch: 'E4', duration: '8n' },
      { pitch: 'C4', duration: '8n' },
      { pitch: 'A3', duration: '8n' },
      { pitch: null, duration: '8n' },
      { pitch: 'A3', duration: '4n' },
    ]
  },
  select: {
    wave: 'square',
    volume: 0.4,
    notes: [
      { pitch: 'A4', duration: '32n' },
      { pitch: 'A5', duration: '16n' },
    ]
  },
  cancel: {
    wave: 'square',
    volume: 0.4,
    notes: [
      { pitch: 'A4', duration: '32n' },
      { pitch: 'E4', duration: '16n' },
    ]
  },
  explosion: {
    wave: 'noise',
    volume: 0.8,
    notes: [
      { pitch: 'C2', duration: '4n' },
    ]
  },
  laser: {
    wave: 'square',
    volume: 0.4,
    notes: [
      { pitch: 'C6', duration: '32n' },
      { pitch: 'G5', duration: '32n' },
      { pitch: 'C5', duration: '32n' },
    ]
  },
  '1up': {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'E4', duration: '16n' },
      { pitch: 'G4', duration: '16n' },
      { pitch: 'E5', duration: '16n' },
      { pitch: 'C5', duration: '16n' },
      { pitch: 'D5', duration: '16n' },
      { pitch: 'G5', duration: '8n' },
    ]
  }
}
```

**Step 2: Implement SEPlayer**

```ts
// src/se-player.ts
import { SEDefinition } from './types'
import { SE_PRESETS } from './presets/se'
import { Synth } from './synth'
import { noteToFrequency } from './utils/note'
import { durationToSeconds } from './utils/timing'
import { createNoiseNode } from './noise'

const DEFAULT_BPM = 240 // Fast tempo for short SFX

export class SEPlayer {
  private ctx: AudioContext

  constructor(ctx: AudioContext) {
    this.ctx = ctx
  }

  play(nameOrDef: string | SEDefinition, options?: { pitch?: number }): void {
    const def = typeof nameOrDef === 'string' ? SE_PRESETS[nameOrDef] : nameOrDef
    if (!def) throw new Error(`Unknown SE preset: ${nameOrDef}`)

    const pitchMult = options?.pitch ?? 1.0
    const startTime = this.ctx.currentTime
    const gain = this.ctx.createGain()
    gain.gain.value = def.volume ?? 0.5
    gain.connect(this.ctx.destination)

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
          osc.type = def.wave === 'square' ? 'square' : 'triangle'
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
```

**Step 3: Commit**

```bash
git add src/se-player.ts src/presets/se.ts
git commit -m "feat: add SEPlayer with 10 preset sound effects"
```

---

### Task 6: SoundEngine (main API)

**Files:**
- Create: `src/engine.ts`
- Modify: `src/index.ts`

**Step 1: Implement SoundEngine**

```ts
// src/engine.ts
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
```

**Step 2: Export from index.ts**

```ts
// src/index.ts
export { createSoundEngine, SoundEngine } from './engine'
export type { BGMDefinition, SEDefinition, ChannelDefinition, NoteEvent, WaveType } from './types'
```

**Step 3: Commit**

```bash
git add src/engine.ts src/index.ts
git commit -m "feat: add SoundEngine as main API entry point"
```

---

### Task 7: Demo BGM Definitions

**Files:**
- Create: `demo/bgm/overworld.ts`
- Create: `demo/bgm/dungeon.ts`
- Create: `demo/bgm/battle.ts`

Compose 3 short distinct 8bit BGM tracks (8-16 bars each) using the JSON format. These should sound recognizably different: cheerful overworld, dark dungeon, intense battle.

**Step 1: Create the 3 BGM definitions**

(Full note sequences to be composed during implementation)

**Step 2: Commit**

```bash
git add demo/bgm
git commit -m "feat: add 3 demo BGM tracks (overworld, dungeon, battle)"
```

---

### Task 8: Pixel Art Demo Page

**Files:**
- Create: `demo/main.ts`
- Create: `demo/style.css`
- Modify: `index.html`

**Step 1: Create pixel art CSS**

Key design elements:
- Press Start 2P font (Google Fonts)
- CSS pixel borders using box-shadow
- Dark background with CRT-like scanline overlay
- Pixel art buttons with hover/active states
- Color palette: NES-inspired (limited colors)

**Step 2: Create demo/main.ts**

- Initialize SoundEngine
- Wire up BGM buttons (Overworld / Dungeon / Battle / Stop)
- Wire up SE buttons (all 10 presets)
- Visual feedback: active button highlight, channel activity indicators

**Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>8bit Sound Engine Demo</title>
  <link rel="stylesheet" href="/demo/style.css">
</head>
<body>
  <div id="app">
    <h1>8BIT SOUND ENGINE</h1>
    <section class="bgm-section">
      <h2>BGM</h2>
      <div class="button-grid">
        <button data-bgm="overworld">OVERWORLD</button>
        <button data-bgm="dungeon">DUNGEON</button>
        <button data-bgm="battle">BATTLE</button>
        <button data-bgm="stop">STOP</button>
      </div>
    </section>
    <section class="se-section">
      <h2>SOUND EFFECTS</h2>
      <div class="button-grid">
        <button data-se="jump">JUMP</button>
        <button data-se="coin">COIN</button>
        <button data-se="damage">DAMAGE</button>
        <button data-se="powerup">POWERUP</button>
        <button data-se="gameover">GAMEOVER</button>
        <button data-se="select">SELECT</button>
        <button data-se="cancel">CANCEL</button>
        <button data-se="explosion">EXPLOSION</button>
        <button data-se="laser">LASER</button>
        <button data-se="1up">1UP</button>
      </div>
    </section>
  </div>
  <script type="module" src="/demo/main.ts"></script>
</body>
</html>
```

**Step 4: Test manually in browser**

Run: `npx vite`
Expected: Pixel art page loads, BGM plays when buttons clicked, SE triggers work, scene switching fades work

**Step 5: Commit**

```bash
git add index.html demo/
git commit -m "feat: add pixel art demo page with BGM and SE controls"
```

---

### Task 9: Polish and Verify

**Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: All PASS

**Step 2: Build library**

Run: `npx vite build`
Expected: dist/ contains bundled library

**Step 3: Manual QA in browser**

- [ ] All 3 BGMs play and loop correctly
- [ ] BGM scene switching fades smoothly
- [ ] All 10 SE presets sound distinct
- [ ] SE plays on top of BGM without interrupting
- [ ] No console errors
- [ ] Pixel art UI looks good

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: polish and verify all features"
```
