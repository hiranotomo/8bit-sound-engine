/**
 * Seed script: populates Vercel KV with preset BGMs
 * Usage: ADMIN_KEY=xxx API_URL=https://8bit-eight.vercel.app npx tsx scripts/seed.ts
 * For local: ADMIN_KEY=xxx API_URL=http://localhost:3000 npx tsx scripts/seed.ts
 */

import { office } from '../demo/bgm/office'
import { nature } from '../demo/bgm/nature'
import { battle } from '../demo/bgm/battle'
import { dungeon } from '../demo/bgm/dungeon'
import { overworld } from '../demo/bgm/overworld'
import type { BGMDefinition } from '../src/types'

const API_URL = process.env.API_URL || 'http://localhost:3000'
const ADMIN_KEY = process.env.ADMIN_KEY

if (!ADMIN_KEY) {
  console.error('ADMIN_KEY environment variable is required')
  process.exit(1)
}

interface SeedEntry {
  title: string
  tags: string[]
  prompt: string
  definition: BGMDefinition
}

const seeds: SeedEntry[] = [
  {
    title: 'Office / City',
    tags: ['city', 'upbeat', 'work', 'morning'],
    prompt: 'bustling city morning, DQ town style',
    definition: office,
  },
  {
    title: 'Nature / Adventure',
    tags: ['forest', 'calm', 'cozy', 'exploration'],
    prompt: 'slow spacious cozy afternoon, Animal Crossing style',
    definition: nature,
  },
  {
    title: 'Battle',
    tags: ['combat', 'intense', 'boss', 'action'],
    prompt: 'intense fast-paced combat, driving rhythm',
    definition: battle,
  },
  {
    title: 'Dungeon',
    tags: ['dark', 'mysterious', 'underground', 'eerie'],
    prompt: 'dark mysterious dungeon, sparse chromatic melody',
    definition: dungeon,
  },
  {
    title: 'Overworld',
    tags: ['adventure', 'journey', 'map', 'cheerful'],
    prompt: 'cheerful overworld map theme, bouncy syncopated melody',
    definition: overworld,
  },
]

async function seed() {
  const ids: string[] = []

  for (const entry of seeds) {
    console.log(`Seeding: ${entry.title}...`)
    const res = await fetch(`${API_URL}/api/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_KEY}`,
      },
      body: JSON.stringify({
        title: entry.title,
        prompt: entry.prompt,
        tags: entry.tags,
        definition: entry.definition,
        isPreset: true,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`  Failed: ${res.status} ${text}`)
      continue
    }

    const data = await res.json()
    console.log(`  Created: ${data.id} → ${data.url}`)
    ids.push(data.id)
  }

  console.log(`\nSeeded ${ids.length} presets: ${ids.join(', ')}`)
}

seed().catch(console.error)
