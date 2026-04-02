# 8bit Sound Engine — Integration Guide for AI Coding Assistants

> Add chiptune BGM and sound effects to any web app. Zero dependencies, pure Web Audio API.

## Quick Setup

### CDN (simplest — one script tag)

```html
<script src="https://8bit-eight.vercel.app/sdk.js"></script>
<script>
  const engine = EightBit.createSoundEngine()
</script>
```

### npm

```bash
npm install 8bit-sound-engine
```

```ts
import { createSoundEngine } from '8bit-sound-engine'
const engine = createSoundEngine()
```

### With reverb

```ts
const engine = createSoundEngine({
  reverb: { duration: 1.8, decay: 2.5, mix: 0.2 }
})
```

## Core API

```ts
// BGM
engine.bgm.play(definition)                    // Start BGM
engine.bgm.changeTo(definition, { fade: 500 }) // Crossfade to another BGM
engine.bgm.stop({ fade: 300 })                 // Stop with fade
engine.bgm.setVariation('FULL')                // Apply named variation
engine.bgm.setChannelMute(0, true)             // Mute channel by index
engine.bgm.toggleChannel(0)                    // Toggle channel mute
engine.bgm.setChannelPan(0, -0.5)             // Pan channel (-1 left, 1 right)

// Sound Effects
engine.se.play('coin')                         // Play preset SE
engine.se.play('jump', { pitch: 1.2 })         // Play with pitch shift
engine.se.play(customSEDefinition)             // Play custom SE

// Engine
await engine.resume()                          // Resume AudioContext (call from user gesture)
engine.setReverbMix(0.3)                       // Adjust reverb wet/dry mix
```

## IMPORTANT: BGM Integration — Ask the User First

When adding BGM to a web project, **you MUST ask the project owner** which approach they prefer, using AskUserQuestion or equivalent:

**Question:** "BGM を再生するにはユーザー操作が必要です。どちらの方法にしますか？"

**Option 1: Splash Screen (recommended for immersive apps)**
- Display a full-screen splash/welcome screen matching the project's design
- Include a "Enter" or "Start" button that triggers BGM playback
- The splash screen should feel like part of the app, not a generic overlay
- After clicking, the splash fades out and the app loads with BGM playing

**Option 2: BGM Toggle Button (recommended for tools/dashboards)**
- Add a small music note button (🎵) in the header or corner
- Clicking it starts BGM; clicking again pauses
- Show a visual indicator when music is playing
- Non-intrusive, user can ignore it

Do NOT auto-play or silently add BGM without asking. The choice affects UX significantly.

### Other Questions to Ask the User

When integrating 8bit sound, ask these questions as needed (use AskUserQuestion):

**BGM Selection:**
- "Which BGM style fits your app? (1) Upbeat/City (2) Calm/Nature (3) Intense/Battle (4) Dark/Dungeon (5) Adventure/Overworld (6) AI-compose a custom one"
- If they choose AI compose: "Describe the mood/style you want for the BGM"

**Sound Effects Scope:**
- "Which interactions should have sound effects? (1) All buttons and navigation (2) Only important actions (success, error, rewards) (3) Let me choose per-element"

**Reverb:**
- "Do you want reverb on the audio? (1) Yes, subtle (mix: 0.15) (2) Yes, noticeable (mix: 0.3) (3) No reverb"

**Volume Control:**
- "Should users be able to control volume? (1) Yes, add a volume slider (2) Just a mute/unmute toggle (3) No volume control needed"

**Page Transitions:**
- If the app has multiple pages/routes: "Should BGM continue across page navigation, or change per page?"

Do NOT assume answers to these questions. Ask, then implement based on the user's preferences.

## Pattern Catalog — When X, Use Y

| Scenario | Code |
|----------|------|
| User clicks a button | `engine.se.play('select')` |
| User cancels / goes back | `engine.se.play('cancel')` |
| User completes a task | `engine.se.play('powerup')` |
| User earns a reward | `engine.se.play('coin')` |
| User levels up / extra life | `engine.se.play('1up')` |
| User makes an error | `engine.se.play('damage')` |
| Something explodes | `engine.se.play('explosion')` |
| Projectile / laser shot | `engine.se.play('laser')` |
| Character jumps | `engine.se.play('jump')` |
| Game over | `engine.se.play('gameover')` |
| Enter a calm scene | `engine.bgm.play(natureBGM)` |
| Enter a busy scene | `engine.bgm.play(officeBGM)` |
| Transition between scenes | `engine.bgm.changeTo(newBGM, { fade: 500 })` |
| Reduce intensity | `engine.bgm.setVariation('SOLO')` |
| Full intensity | `engine.bgm.setVariation('FULL')` |

## Preset Sound Effects

| Name | Sound | Best For |
|------|-------|----------|
| `select` | Quick high blip | Button clicks, menu navigation |
| `cancel` | Quick low blip | Back button, dismiss, close |
| `coin` | Two-tone chime | Rewards, collecting items, earning points |
| `jump` | Rising arpeggio | Jump action, upward movement |
| `powerup` | Ascending scale | Level up, power-up, achievement |
| `1up` | Musical fanfare | Extra life, major milestone |
| `damage` | Descending tones | Taking damage, errors, warnings |
| `gameover` | Sad descending | Game over, failure state |
| `explosion` | Noise burst | Explosions, destruction |
| `laser` | Quick descending | Shooting, zapping |

## Custom Sound Effects

```ts
import type { SEDefinition } from '8bit-sound-engine'

const mySound: SEDefinition = {
  wave: 'square',     // 'square' | 'triangle' | 'sawtooth' | 'noise'
  volume: 0.5,        // 0.0 - 1.0
  notes: [
    { pitch: 'C5', duration: '16n' },
    { pitch: 'E5', duration: '16n' },
    { pitch: 'G5', duration: '8n' },
  ]
}

engine.se.play(mySound)
```

**Pitch format:** `C4`, `F#5`, `Bb3`, or `null` for rest
**Duration format:** `1n` (whole), `2n` (half), `4n` (quarter), `8n` (eighth), `16n`, `32n`

## BGM Definition Format

```ts
import type { BGMDefinition } from '8bit-sound-engine'

const myBGM: BGMDefinition = {
  bpm: 120,
  loop: true,
  variations: [
    { name: 'FULL',  layers: [true, true, true, true] },
    { name: 'LIGHT', layers: [true, false, true, false] },
    { name: 'SOLO',  layers: [true, false, false, false] },
  ],
  channels: [
    {
      wave: 'square',
      label: 'melody',
      volume: 0.3,
      pan: 0.2,        // -1 (left) to 1 (right)
      notes: [
        { pitch: 'C4', duration: '4n' },
        { pitch: 'E4', duration: '4n' },
        { pitch: 'G4', duration: '2n' },
      ]
    },
    {
      wave: 'triangle',
      label: 'bass',
      volume: 0.35,
      pan: -0.2,
      notes: [
        { pitch: 'C2', duration: '2n' },
        { pitch: 'G2', duration: '2n' },
      ]
    }
  ]
}
```

### Channel wave types

| Wave | Sound | Typical Use |
|------|-------|-------------|
| `square` | Bright, buzzy | Melody, harmony, rhythm |
| `triangle` | Warm, soft | Bass, gentle melody |
| `sawtooth` | Rich, brassy | Pad, harmony, chords |
| `noise` | White noise | Percussion (not yet supported in BGM channels) |

### Variations

Variations are named presets that mute/unmute channels. The `layers` array maps 1:1 to the `channels` array — `true` means active, `false` means muted.

```ts
// Apply a variation
engine.bgm.setVariation('SOLO')   // Only melody plays
engine.bgm.setVariation('FULL')   // All channels play

// Or control channels directly
engine.bgm.setChannelMute(1, true)  // Mute bass
engine.bgm.toggleChannel(2)         // Toggle harmony
```

## Preset BGMs

### Office / City (`office`)
- **BPM:** 144, **Key:** Bb major
- **Style:** DQ town — bustling, energetic walking bass
- **Channels:** melody (triangle), bass (triangle), harmony (sawtooth), rhythm (square)
- **Variations:** FULL, HUSTLE (bass+rhythm), FOCUS (melody+harmony), COFFEE (melody+bass), ELEVATOR (harmony+rhythm), SOLO (melody only)
- **Tags:** work, productivity, city, upbeat, busy

### Nature / Adventure (`nature`)
- **BPM:** 92, **Key:** G major
- **Style:** Animal Crossing — slow, spacious, cozy afternoon
- **Channels:** melody (square), bass (triangle), harmony (sawtooth), arpeggio (triangle)
- **Variations:** FULL, RIVERSIDE (no melody), FIREFLY (melody+harmony), CAMPFIRE (melody+bass), RAIN (harmony+arpeggio), SOLO (melody only)
- **Tags:** calm, nature, relaxing, cozy, adventure

## Full Working Example

```html
<!DOCTYPE html>
<html>
<head><title>8bit Sound Demo</title></head>
<body>
  <button id="play">Play BGM</button>
  <button id="coin">Coin!</button>
  <button id="stop">Stop</button>

  <script src="https://8bit-eight.vercel.app/sdk.js"></script>
  <script>
    const engine = EightBit.createSoundEngine({
      reverb: { duration: 1.5, decay: 2.0, mix: 0.2 }
    })

    const bgm = {
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
            { pitch: 'E4', duration: '4n' },
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
    }

    document.getElementById('play').onclick = async () => {
      await engine.resume()
      engine.bgm.play(bgm)
    }

    document.getElementById('coin').onclick = async () => {
      await engine.resume()
      engine.se.play('coin')
    }

    document.getElementById('stop').onclick = () => {
      engine.bgm.stop({ fade: 300 })
    }
  </script>
</body>
</html>
```

## Remote Song Loading (Studio API)

Load songs from the 8bit Studio API:

```ts
// Fetch a song by ID and play it
const res = await fetch('https://8bit-eight.vercel.app/api/songs/290679c1')
const song = await res.json()
engine.bgm.play(song.definition)
```

### Studio API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/songs` | List all songs (meta only) |
| `GET /api/songs?preset=true` | List preset songs only |
| `GET /api/songs/:id` | Get song definition + meta |
| `POST /api/compose` | AI-compose a BGM from text prompt |
| `GET /s/:id` | Shareable player page |

### Composition API

Generate a BGM from a text prompt using AI:

```ts
const res = await fetch('https://8bit-eight.vercel.app/api/compose', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'cheerful morning forest, Zelda style' })
})
const { id, definition, meta } = await res.json()
engine.bgm.play(definition)
// Song is auto-saved and available at /s/{id}
```

Remix an existing song:

```ts
const base = await fetch('https://8bit-eight.vercel.app/api/songs/290679c1').then(r => r.json())
const res = await fetch('https://8bit-eight.vercel.app/api/compose', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'make it darker and slower',
    base: base.definition
  })
})
const { definition } = await res.json()
engine.bgm.play(definition)
```

Rate limit: 5 compositions per hour per IP.

### Available Presets

| ID | Title | Tags |
|----|-------|------|
| `290679c1` | Office / City | city, upbeat, work, morning |
| `6d8cc967` | Nature / Adventure | forest, calm, cozy, exploration |
| `a8c13760` | Battle | combat, intense, boss, action |
| `e53b8e03` | Dungeon | dark, mysterious, underground, eerie |
| `d101122a` | Overworld | adventure, journey, map, cheerful |

## Important Notes

- Always call `await engine.resume()` inside a user gesture handler (click, touch, keydown) before first playback. Browsers require user interaction to start audio.
- The engine auto-handles iOS Safari audio unlock (touchend, silent buffer, visibilitychange recovery).
- BGM channels skip `noise` wave type — noise is for SE only.
- Reverb is optional. Pass `reverb: false` or omit for no reverb.
- All audio is synthesized in real-time — no audio files needed.
