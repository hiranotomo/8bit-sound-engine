# 8bit Sound Engine — Platform Design

## Overview

8bit Sound Engine is a Web Audio API-based chiptune sound platform with three distribution channels: a web studio for composing/sharing, a CDN for instant integration, and an npm package for TypeScript projects. The primary integration target is AI coding assistants (Claude Code), which read AGENTS.md to automatically add context-aware sound to web applications.

## Product Structure

### Three Distribution Channels

| Channel | URL / Delivery | Audience |
|---|---|---|
| **Studio** | 8bit-eight.vercel.app | Composers, developers browsing presets |
| **CDN** | 8bit-eight.vercel.app/sdk.js | Claude Code integrating into existing apps |
| **npm** | npm install 8bit-sound-engine | TypeScript / build-tool projects |

### Studio Pages

```
8bit-eight.vercel.app/
  /              → Presets + Library + Compose (main studio)
  /docs          → Getting Started, API reference, code examples
  /docs/install  → CDN and npm setup, first sound in 30 seconds
  /docs/api      → Full API reference (BGM, SE, reverb, variations)
  /docs/compose  → How to use the composition studio
  /s/[id]        → Shared song (listen + copy code)
```

### Studio Features

**Presets**
- Curated BGM collection maintained by the project owner
- Each preset has: name, mood tags, recommended use case, preview
- "Remix this" button → opens in Compose with the preset as base

**Library**
- User-published songs (no auth required, rate-limited)
- Browse, preview, copy code, or remix
- Owner can promote library songs to presets

**Compose**
- Text prompt input: "cheerful morning city, DQ town style"
- Two modes: create from scratch OR remix an existing preset/library song
- Preview with arrangement variations and mixer controls
- Publish to library with one click

**Shared URLs**
- `/s/[id]` opens a minimal player page for a specific song
- "Use in your app" button shows CDN and npm code snippets

## Library Architecture

### Core Engine (8bit-sound-engine)

```
src/
  engine.ts        → SoundEngine (lazy init, iOS-safe)
  bgm-player.ts    → BGMPlayer (layers, variations, fade, pan)
  se-player.ts     → SEPlayer (presets + custom, random pan)
  reverb.ts        → Algorithmic reverb (ConvolverNode)
  noise.ts         → White noise generator
  synth.ts         → Oscillator wrapper
  types.ts         → BGMDefinition, SEDefinition, ChannelDefinition
  utils/
    note.ts        → Note-to-frequency (sharps + flats)
    timing.ts      → Duration-to-seconds
  presets/
    se.ts          → 10 built-in SE presets
```

### Package Exports

```ts
// CDN: global
const engine = EightBit.create({ reverb: true })

// ESM: npm
import { createSoundEngine } from '8bit-sound-engine'
const engine = createSoundEngine({ reverb: true })
```

### API Surface

```ts
// BGM
engine.bgm.play(definition)
engine.bgm.changeTo(definition, { fade: 500 })
engine.bgm.stop({ fade: 300 })
engine.bgm.setChannelMute(index, muted)
engine.bgm.toggleChannel(index)
engine.bgm.setChannelPan(index, pan)

// SE
engine.se.play('coin')
engine.se.play('damage', { pitch: 0.8 })
engine.se.play(customDefinition)

// Engine
engine.resume()
engine.setReverbMix(0.3)

// Remote loading
const bgm = await fetch('https://8bit-eight.vercel.app/api/songs/abc123').then(r => r.json())
engine.bgm.play(bgm)
```

### AGENTS.md (Claude Code Integration Guide)

Included in the npm package and served at `/docs`. This is the most critical file — it teaches Claude Code how to add sound to any web app.

Contents:
- Quick setup (CDN 1-line or npm install)
- Pattern catalog: "when X happens, use Y"
- Preset BGM catalog with mood/use-case tags
- SE catalog with recommended UI mapping
- Variation patterns for state changes
- Full code examples

**Pattern catalog example:**

```markdown
## When to Use What

### Page/Scene Transitions
- Page load → engine.bgm.play(preset)
- Route change → engine.bgm.changeTo(newPreset, { fade: 500 })
- App backgrounded → engine.bgm.stop({ fade: 1000 })

### UI State Changes
- Modal/dialog open → engine.bgm.setChannelMute(0, true) // mute melody
- Modal close → engine.bgm.setChannelMute(0, false)
- Loading state → applyVariation('ambient')
- Loading complete → applyVariation('full')
- Focus mode → applyVariation('focus')

### User Actions
- Button click → engine.se.play('select')
- Success/reward → engine.se.play('coin')
- Error/fail → engine.se.play('damage')
- Level up/upgrade → engine.se.play('powerup')
- Delete/remove → engine.se.play('cancel')
- Achievement → engine.se.play('1up')
- Submit form → engine.se.play('select')
- Toggle on → engine.se.play('coin', { pitch: 1.2 })
- Toggle off → engine.se.play('cancel', { pitch: 0.8 })
```

### BGMDefinition Format

```ts
interface BGMDefinition {
  bpm: number
  loop?: boolean
  channels: ChannelDefinition[]
  variations?: Record<string, boolean[]>  // NEW: named variation presets
}

interface ChannelDefinition {
  wave: 'square' | 'triangle' | 'sawtooth' | 'noise'
  label?: string    // NEW: human-readable name (e.g. 'melody', 'bass')
  volume?: number
  pan?: number
  notes: NoteEvent[]
}
```

## Composition Engine

### Architecture

```
compose/
  rules.md         → Music theory rules, scale constraints, rhythm patterns
  examples/        → Good prompt→BGMDefinition pairs (few-shot examples)
  evaluate.ts      → Auto-validation (pitch range, bar count, duplicate check)
```

### How It Works

1. User enters prompt: "cheerful forest adventure, Zelda style"
2. (Optional) Base song provided for remixing
3. Server-side API Route calls Claude API with:
   - compose/rules.md (music theory rules)
   - compose/examples/ (few-shot examples)
   - BGMDefinition JSON schema
   - Base song (if remixing)
   - User prompt
4. Claude returns BGMDefinition JSON
5. evaluate.ts validates the output
6. Client plays it immediately

### Improving the Engine

The owner (you) improves composition quality by:
1. Composing with Claude Code, listening to results
2. Giving feedback ("melody too busy", "bass too static")
3. Claude Code fixes the song AND updates compose/rules.md
4. rules.md accumulates better constraints over time
5. All future compositions improve

### API Route

```
POST /api/compose
Body: { prompt: string, base?: BGMDefinition }
Response: BGMDefinition
```

## Storage

### Vercel KV Schema

```
songs:{id}  → { definition: BGMDefinition, meta: SongMeta }
presets     → string[] (list of song IDs curated by owner)
```

```ts
interface SongMeta {
  id: string
  title: string
  prompt: string          // original prompt used
  basedOn?: string        // ID of remixed song
  tags: string[]          // mood/use-case tags
  createdAt: string
  isPreset: boolean
}
```

## Implementation Phases

### Phase 1: Library Cleanup
- Add `label` and `variations` to BGMDefinition
- Move variation presets from demo into BGMDefinition
- Clean up package.json for npm publish
- Build CDN bundle (sdk.js with global EightBit)
- Write AGENTS.md
- Add LICENSE

### Phase 2: Studio
- Redesign demo page into studio (presets, library, compose tabs)
- Set up Vercel KV
- API routes: /api/songs, /api/songs/[id]
- Preset management
- Shared URL pages (/s/[id])

### Phase 3: Composition Engine
- Create compose/rules.md with initial music theory rules
- Create compose/examples/ with curated prompt→BGM pairs
- API route: /api/compose (Claude API integration)
- Compose UI: prompt input, preview, publish
- Remix flow: load existing song → modify via prompt

### Phase 4: Documentation
- /docs pages with pixel art design
- Getting Started (CDN + npm)
- API reference
- Compose guide
- Code examples for common patterns
