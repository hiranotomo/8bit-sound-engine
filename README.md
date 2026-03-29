# 8bit Sound Engine

A lightweight, dependency-free 8-bit game music engine built on the Web Audio API. Generate chiptune BGM and sound effects entirely from code — no audio files needed.

**[Live Demo](https://8bit-eight.vercel.app)**

## Features

- **Programmatic synthesis** — Square wave, triangle wave, and noise channels (NES/Famicom style)
- **BGM playback** — Define tracks as JSON, loop with fade transitions between scenes
- **10 built-in sound effects** — Jump, coin, damage, powerup, gameover, select, cancel, explosion, laser, 1up
- **Custom sound effects** — Define your own SE with the same JSON format
- **Zero dependencies** — Pure Web Audio API, under 4KB gzipped
- **TypeScript** — Full type definitions included

## Quick Start

```bash
npm install 8bit-sound-engine
```

```ts
import { createSoundEngine } from '8bit-sound-engine'

const engine = createSoundEngine()

// Play a preset sound effect
engine.se.play('coin')
engine.se.play('jump')

// Define and play BGM
engine.bgm.play({
  bpm: 140,
  loop: true,
  channels: [
    {
      wave: 'square',
      volume: 0.5,
      notes: [
        { pitch: 'C4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'G4', duration: '4n' },
      ]
    },
    {
      wave: 'triangle',
      volume: 0.4,
      notes: [
        { pitch: 'C2', duration: '2n' },
        { pitch: 'G2', duration: '2n' },
      ]
    }
  ]
})

// Switch BGM with crossfade
engine.bgm.changeTo(otherTrack, { fade: 500 })

// Stop BGM
engine.bgm.stop({ fade: 300 })
```

## API

### `createSoundEngine()`

Creates and returns a `SoundEngine` instance.

### `engine.bgm`

| Method | Description |
|--------|-------------|
| `play(definition)` | Start playing a BGM track |
| `changeTo(definition, { fade? })` | Crossfade to a different track |
| `stop({ fade? })` | Stop playback with optional fade-out |

### `engine.se`

| Method | Description |
|--------|-------------|
| `play(name)` | Play a preset sound effect by name |
| `play(name, { pitch? })` | Play with pitch adjustment |
| `play(definition)` | Play a custom sound effect |

### `engine.resume()`

Resume the AudioContext (required after user interaction in browsers).

## BGM Definition Format

```ts
interface BGMDefinition {
  bpm: number
  loop?: boolean
  channels: ChannelDefinition[]
}

interface ChannelDefinition {
  wave: 'square' | 'triangle' | 'noise'
  duty?: number          // Square wave duty cycle (default: 0.5)
  volume?: number        // 0.0 - 1.0 (default: 0.5)
  notes: NoteEvent[]
}

interface NoteEvent {
  pitch: string | null   // e.g. 'C4', 'F#5', 'Bb3', or null for rest
  duration: string       // '1n', '2n', '4n', '8n', '16n', '32n'
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
npx vite          # Start dev server with demo page
npx vitest        # Run tests
npx vite build    # Build library
```

## License

MIT
