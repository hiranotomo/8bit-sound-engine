# Phase 1: Library Cleanup & Publish — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the prototype into a publishable npm package + CDN bundle with AGENTS.md for Claude Code integration.

**Architecture:** Add `label` and `variations` to BGMDefinition so variations are self-contained in song data instead of hardcoded in the demo. Build two outputs: ESM for npm, IIFE for CDN (sdk.js). AGENTS.md teaches Claude Code how to integrate sound into any web app.

**Tech Stack:** TypeScript, Vite (library mode), Vitest, npm

---

### Task 1: Update Types — Add label and variations to BGMDefinition

**Files:**
- Modify: `src/types.ts`
- Modify: `tests/utils/note.test.ts` (no change needed, just verify tests still pass)

**Step 1: Update types**

```ts
// src/types.ts
export type WaveType = 'square' | 'triangle' | 'sawtooth' | 'noise'

export interface NoteEvent {
  pitch: string | null
  duration: string
}

export interface ChannelDefinition {
  wave: WaveType
  label?: string    // e.g. 'melody', 'bass', 'harmony', 'rhythm'
  duty?: number
  volume?: number
  pan?: number
  notes: NoteEvent[]
}

export interface Variation {
  name: string
  layers: boolean[]  // which channels are active
}

export interface BGMDefinition {
  bpm: number
  loop?: boolean
  channels: ChannelDefinition[]
  variations?: Variation[]  // named arrangement presets
}

export interface SEDefinition {
  wave: WaveType
  notes: NoteEvent[]
  volume?: number
}
```

**Step 2: Run tests**

Run: `npx vitest run`
Expected: All 9 tests PASS (types are interfaces, no runtime change)

**Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add label and variations to BGMDefinition type"
```

---

### Task 2: Add setVariation API to BGMPlayer

**Files:**
- Modify: `src/bgm-player.ts`

**Step 1: Add setVariation method**

Add this public method to BGMPlayer (after toggleChannel):

```ts
/** Apply a named variation from the current BGM's variations list */
setVariation(name: string): void {
  if (!this.currentDefinition?.variations) return
  const v = this.currentDefinition.variations.find(v => v.name === name)
  if (!v) return
  for (let i = 0; i < v.layers.length; i++) {
    this.setChannelMute(i, !v.layers[i])
  }
}
```

This requires storing the current definition. Add a private field:

```ts
private currentDefinition: BGMDefinition | null = null
```

Set it in `play()` and `changeTo()`:
```ts
play(definition: BGMDefinition): void {
  this.stopImmediate()
  this.currentDefinition = definition
  // ... rest unchanged
}
```

Also update `changeTo()` similarly, and clear in `stopImmediate()`:
```ts
this.currentDefinition = null
```

**Step 2: Export Variation type from index.ts**

```ts
export type { BGMDefinition, SEDefinition, ChannelDefinition, NoteEvent, WaveType, Variation } from './types'
```

**Step 3: Run tests**

Run: `npx vitest run`
Expected: PASS

**Step 4: Commit**

```bash
git add src/bgm-player.ts src/index.ts
git commit -m "feat: add setVariation API to BGMPlayer"
```

---

### Task 3: Add labels and variations to demo BGMs

**Files:**
- Modify: `demo/bgm/office.ts`
- Modify: `demo/bgm/nature.ts`
- Modify: `demo/main.ts` (use definition.variations instead of hardcoded)

**Step 1: Add labels and variations to office.ts**

Add `label` to each channel and `variations` to the definition:

```ts
export const office: BGMDefinition = {
  bpm: 144,
  loop: true,
  variations: [
    { name: 'FULL',     layers: [true,  true,  true,  true]  },
    { name: 'HUSTLE',   layers: [false, true,  false, true]  },
    { name: 'FOCUS',    layers: [true,  false, true,  false] },
    { name: 'COFFEE',   layers: [true,  true,  false, false] },
    { name: 'ELEVATOR', layers: [false, false, true,  true]  },
    { name: 'SOLO',     layers: [true,  false, false, false] },
  ],
  channels: [
    { wave: 'triangle', label: 'melody', volume: 0.35, pan: 0.25, notes: [ /* unchanged */ ] },
    { wave: 'triangle', label: 'bass',   volume: 0.3,  pan: -0.25, notes: [ /* unchanged */ ] },
    { wave: 'sawtooth', label: 'harmony', volume: 0.12, pan: -0.3, notes: [ /* unchanged */ ] },
    { wave: 'square',   label: 'rhythm', volume: 0.15, pan: 0.1, notes: [ /* unchanged */ ] },
  ]
}
```

**Step 2: Same for nature.ts**

Add labels ('melody', 'bass', 'harmony', 'arpeggio') and variations:
```ts
variations: [
  { name: 'FULL',      layers: [true,  true,  true,  true]  },
  { name: 'RIVERSIDE', layers: [false, true,  true,  true]  },
  { name: 'FIREFLY',   layers: [true,  false, true,  false] },
  { name: 'CAMPFIRE',  layers: [true,  true,  false, false] },
  { name: 'RAIN',      layers: [false, false, true,  true]  },
  { name: 'SOLO',      layers: [true,  false, false, false] },
],
```

**Step 3: Update demo/main.ts to read variations from definition**

Replace the hardcoded `variations` object with:
```ts
function getVariations(): Variation[] {
  if (!currentBGM) return []
  const def = bgms[currentBGM as keyof typeof bgms]
  return def.variations || []
}
```

Update `updateVariationPanel()` to use `getVariations()` instead of `variations[currentBGM]`.

Update `applyVariation()` to use `engine.bgm.setVariation(name)` instead of manual setChannelMute loops.

Remove the hardcoded `variations` and `Variation` interface from main.ts.

**Step 4: Run tests and verify in browser**

Run: `npx vitest run`
Run: `npx vite` and test in browser

**Step 5: Commit**

```bash
git add demo/bgm/office.ts demo/bgm/nature.ts demo/main.ts
git commit -m "feat: move variations into BGMDefinition, use setVariation API"
```

---

### Task 4: Package.json for npm publish

**Files:**
- Modify: `package.json`
- Create: `LICENSE`

**Step 1: Update package.json**

```json
{
  "name": "8bit-sound-engine",
  "version": "0.2.0",
  "description": "Chiptune sound engine for web apps — BGM, SE, reverb, variations. Built for AI coding assistants.",
  "type": "module",
  "main": "dist/8bit-sound-engine.cjs",
  "module": "dist/8bit-sound-engine.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/8bit-sound-engine.js",
      "require": "./dist/8bit-sound-engine.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist",
    "AGENTS.md",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build && tsc --emitDeclarationOnly --outDir dist",
    "build:demo": "vite build --mode demo",
    "test": "vitest run",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["8bit", "chiptune", "web-audio", "game-audio", "sound-engine", "retro", "pixel"],
  "author": "hiranotomo",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/hiranotomo/8bit-sound-engine"
  },
  "homepage": "https://8bit-eight.vercel.app",
  "devDependencies": {
    "typescript": "^6.0.2",
    "vite": "^8.0.3",
    "vitest": "^4.1.2"
  }
}
```

**Step 2: Create LICENSE**

MIT license with hiranotomo as author.

**Step 3: Commit**

```bash
git add package.json LICENSE
git commit -m "chore: configure package.json for npm publish"
```

---

### Task 5: Vite build config for library + CDN

**Files:**
- Modify: `vite.config.ts`

**Step 1: Update vite.config.ts**

Three build modes: library (npm), CDN (sdk.js), demo (Vercel site).

```ts
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return {}
  }
  if (mode === 'cdn') {
    return {
      build: {
        lib: {
          entry: 'src/index.ts',
          name: 'EightBit',
          fileName: () => 'sdk.js',
          formats: ['iife']
        },
        outDir: 'public',
        emptyOutDir: false
      }
    }
  }
  // Default: library build (npm)
  return {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'EightBitSound',
        fileName: '8bit-sound-engine',
        formats: ['es', 'cjs']
      }
    }
  }
})
```

**Step 2: Add build scripts to package.json**

Update scripts:
```json
"build": "vite build && tsc --emitDeclarationOnly --outDir dist",
"build:cdn": "vite build --mode cdn",
"build:demo": "vite build --mode demo",
"build:all": "npm run build && npm run build:cdn"
```

**Step 3: Test builds**

Run: `npm run build` → dist/ has .js + .cjs + .d.ts
Run: `npm run build:cdn` → public/sdk.js exists
Run: `npm run build:demo` → dist/ has index.html

**Step 4: Commit**

```bash
git add vite.config.ts package.json
git commit -m "feat: triple build config — npm (ESM+CJS), CDN (IIFE), demo"
```

---

### Task 6: Create AGENTS.md

**Files:**
- Create: `AGENTS.md`

**Step 1: Write AGENTS.md**

Complete Claude Code integration guide. Must include:
- Quick setup (CDN + npm)
- Pattern catalog (when X → use Y)
- Preset BGM catalog with tags
- SE catalog with UI mapping
- Variation usage patterns
- Full working code examples

This is the most important file in the project. It should be thorough enough that Claude Code can integrate sound into any web app without asking the developer any questions.

**Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: create AGENTS.md — Claude Code integration guide"
```

---

### Task 7: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Update README**

- Add CDN usage section
- Add AGENTS.md mention
- Update API docs (variations, setVariation, labels)
- Add Studio link
- Update install instructions

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with CDN, variations, Studio link"
```

---

### Task 8: npm publish dry run + tag

**Step 1: Verify build**

Run: `npm run build`
Run: `ls dist/`
Expected: `8bit-sound-engine.js`, `8bit-sound-engine.cjs`, `index.d.ts`

**Step 2: Dry run**

Run: `npm publish --dry-run`
Verify: files list looks correct, no secrets included

**Step 3: Publish**

Run: `npm publish`

**Step 4: Tag and release**

```bash
git tag v0.2.0
git push origin v0.2.0
gh release create v0.2.0 --title "v0.2.0 — npm + CDN + AGENTS.md" --notes "..."
```

**Step 5: Verify**

Run: `npm info 8bit-sound-engine`
Open: https://8bit-eight.vercel.app/sdk.js

---
