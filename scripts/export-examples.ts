/**
 * Export preset BGMs as few-shot examples for the composition engine.
 * Usage: npx tsx scripts/export-examples.ts
 */

import { writeFileSync } from 'fs'
import { office } from '../demo/bgm/office'
import { nature } from '../demo/bgm/nature'
import { battle } from '../demo/bgm/battle'
import { dungeon } from '../demo/bgm/dungeon'
import { overworld } from '../demo/bgm/overworld'

const examples = [
  {
    name: 'office',
    prompt: 'bustling city office morning, DQ town style, energetic walking bass, triangle melody, Bb major, 144 BPM',
    definition: office,
    _meta: { title: 'Office / City', tags: ['city', 'upbeat', 'work', 'morning'] },
  },
  {
    name: 'nature',
    prompt: 'calm nature afternoon, Animal Crossing style, slow spacious cozy, square staccato melody, G major, 92 BPM',
    definition: nature,
    _meta: { title: 'Nature / Adventure', tags: ['forest', 'calm', 'cozy', 'exploration'] },
  },
  {
    name: 'battle',
    prompt: 'intense fast-paced combat, driving rhythm, rapid arpeggios, urgent melodic lines, E minor, 180 BPM',
    definition: battle,
    _meta: { title: 'Battle', tags: ['combat', 'intense', 'boss', 'action'] },
  },
  {
    name: 'dungeon',
    prompt: 'dark mysterious dungeon, sparse melody, chromatic movement, droning bass, eerie silences, D minor, 80 BPM',
    definition: dungeon,
    _meta: { title: 'Dungeon', tags: ['dark', 'mysterious', 'underground', 'eerie'] },
  },
  {
    name: 'overworld',
    prompt: 'cheerful upbeat overworld adventure, bouncy syncopated melody, walking bass, C major, 150 BPM',
    definition: overworld,
    _meta: { title: 'Overworld', tags: ['adventure', 'journey', 'map', 'cheerful'] },
  },
]

for (const ex of examples) {
  const output = {
    prompt: ex.prompt,
    definition: ex.definition,
    _meta: ex._meta,
  }
  const path = `compose/examples/${ex.name}.json`
  writeFileSync(path, JSON.stringify(output, null, 2) + '\n')
  console.log(`Wrote: ${path}`)
}

console.log(`\nExported ${examples.length} examples.`)
