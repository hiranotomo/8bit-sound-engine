# 8bit Sound Engine

A lightweight, dependency-free 8-bit game music engine built on the Web Audio API. Generate chiptune BGM and sound effects entirely from code — no audio files needed.

**[Live Studio](https://8bit-eight.vercel.app)** | **[AGENTS.md](./AGENTS.md)** (AI integration guide)

## Features

- **Programmatic synthesis** — Square, triangle, sawtooth, and noise channels (NES/Famicom style)
- **BGM playback** — Define tracks as JSON, loop with fade transitions between scenes
- **Variations** — Named arrangement presets to mute/unmute channel layers
- **10 built-in sound effects** — Jump, coin, damage, powerup, gameover, select, cancel, explosion, laser, 1up
- **Custom sound effects** — Define your own SE with the same JSON format
- **Reverb** — Optional convolution reverb with configurable mix
- **Zero dependencies** — Pure Web Audio API, under 3KB gzipped
- **TypeScript** — Full type definitions included
- **AI-ready** — AGENTS.md teaches Claude Code how to add sound to any web app

## Install

### npm

```bash
npm install 8bit-sound-engine
```

```ts
import { createSoundEngine } from '8bit-sound-engine'
const engine = createSoundEngine()
```

### CDN

```html
<script src="https://8bit-eight.vercel.app/sdk.js"></script>
<script>
  const engine = EightBit.createSoundEngine()
</script>
```

## Quick Start

```ts
import { createSoundEngine } from '8bit-sound-engine'

const engine = createSoundEngine({
  reverb: { duration: 1.8, decay: 2.5, mix: 0.2 }
})

// Play a preset sound effect
engine.se.play('coin')
engine.se.play('jump')

// Define and play BGM
engine.bgm.play({
  bpm: 140,
  loop: true,
  variations: [
    { name: 'FULL', layers: [true, true] },
    { name: 'SOLO', layers: [true, false] },
  ],
  channels: [
    {
      wave: 'square',
      label: 'melody',
      volume: 0.3,
      notes: [
        { pitch: 'C4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'G4', duration: '4n' },
      ]
    },
    {
      wave: 'triangle',
      label: 'bass',
      volume: 0.35,
      notes: [
        { pitch: 'C2', duration: '2n' },
        { pitch: 'G2', duration: '2n' },
      ]
    }
  ]
})

// Apply a variation
engine.bgm.setVariation('SOLO')

// Switch BGM with crossfade
engine.bgm.changeTo(otherTrack, { fade: 500 })

// Stop BGM
engine.bgm.stop({ fade: 300 })
```

## API

### `createSoundEngine(options?)`

Creates and returns a `SoundEngine` instance.

Options:
- `reverb` — `boolean | { duration?: number; decay?: number; mix?: number }`

### `engine.bgm`

| Method | Description |
|--------|-------------|
| `play(definition)` | Start playing a BGM track |
| `changeTo(definition, { fade? })` | Crossfade to a different track |
| `stop({ fade? })` | Stop playback with optional fade-out |
| `setVariation(name)` | Apply a named variation preset |
| `setChannelMute(index, muted)` | Mute/unmute a channel by index |
| `toggleChannel(index)` | Toggle channel mute state |
| `setChannelPan(index, pan)` | Set channel pan (-1 left, 1 right) |

### `engine.se`

| Method | Description |
|--------|-------------|
| `play(name)` | Play a preset sound effect by name |
| `play(name, { pitch?, pan? })` | Play with pitch/pan adjustment |
| `play(definition)` | Play a custom sound effect |

### `engine.resume()`

Resume the AudioContext (required after user interaction in browsers).

### `engine.setReverbMix(mix)`

Adjust reverb wet/dry mix (0.0 - 1.0).

## BGM Definition Format

```ts
interface BGMDefinition {
  bpm: number
  loop?: boolean
  channels: ChannelDefinition[]
  variations?: Variation[]
}

interface ChannelDefinition {
  wave: 'square' | 'triangle' | 'sawtooth' | 'noise'
  label?: string           // e.g. 'melody', 'bass', 'harmony'
  duty?: number            // Square wave duty cycle (default: 0.5)
  volume?: number          // 0.0 - 1.0 (default: 0.5)
  pan?: number             // -1 (left) to 1 (right), default 0
  notes: NoteEvent[]
}

interface Variation {
  name: string
  layers: boolean[]        // which channels are active (maps 1:1 to channels)
}

interface NoteEvent {
  pitch: string | null     // e.g. 'C4', 'F#5', 'Bb3', or null for rest
  duration: string         // '1n', '2n', '4n', '8n', '16n', '32n'
}
```

## Preset Sound Effects

`jump` `coin` `damage` `powerup` `gameover` `select` `cancel` `explosion` `laser` `1up`

## Channel Architecture

Inspired by the NES/Famicom audio hardware:

| Channel | Waveform | Typical Use |
|---------|----------|-------------|
| Pulse 1 | Square (variable duty) | Melody |
| Pulse 2 | Square (variable duty) | Harmony |
| Triangle | Triangle | Bass |
| Noise | White noise | Percussion / SFX |

## Development

```bash
npm install
npm run dev           # Start dev server with demo page
npm test              # Run tests
npm run build         # Build library (ESM + CJS)
npm run build:cdn     # Build CDN bundle (public/sdk.js)
npm run build:demo    # Build demo page
npm run build:all     # Build library + CDN
```

## License

MIT
