import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import Anthropic from '@anthropic-ai/sdk'

// --- Inlined shared code (Vercel bundles each function independently) ---

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

function generateId(): string {
  return crypto.randomUUID().slice(0, 8)
}

function isAdmin(req: VercelRequest): boolean {
  return req.headers.authorization === `Bearer ${process.env.ADMIN_KEY}`
}

async function checkRateLimit(ip: string, limit = 5, windowSecs = 3600): Promise<boolean> {
  const key = `ratelimit:compose:${ip}`
  const current = await kv.incr(key)
  if (current === 1) await kv.expire(key, windowSecs)
  return current <= limit
}

// --- Inlined validation (from compose/evaluate.ts) ---

const VALID_WAVES = ['square', 'triangle', 'sawtooth', 'noise']
const VALID_DURATIONS = ['1n', '2n', '4n', '8n', '16n', '32n']
const PITCH_REGEX = /^[A-G][b#]?[1-8]$/

function validateBGMDefinition(input: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!input || typeof input !== 'object') return { valid: false, errors: ['Input must be an object'] }
  const def = input as Record<string, unknown>

  if (typeof def.bpm !== 'number' || def.bpm < 40 || def.bpm > 240)
    errors.push(`bpm must be 40-240, got ${def.bpm}`)

  if (!Array.isArray(def.channels) || def.channels.length === 0)
    return { valid: false, errors: [...errors, 'channels must be a non-empty array'] }

  if (def.channels.length > 6)
    errors.push(`channels must have at most 6 entries, got ${def.channels.length}`)

  for (let i = 0; i < def.channels.length; i++) {
    const ch = def.channels[i] as Record<string, unknown>
    if (!VALID_WAVES.includes(ch.wave as string))
      errors.push(`channels[${i}].wave invalid: '${ch.wave}'`)
    if (ch.volume !== undefined && (typeof ch.volume !== 'number' || (ch.volume as number) < 0 || (ch.volume as number) > 1))
      errors.push(`channels[${i}].volume must be 0-1`)
    if (!Array.isArray(ch.notes) || ch.notes.length === 0) {
      errors.push(`channels[${i}].notes must be non-empty`)
      continue
    }
    for (let j = 0; j < ch.notes.length; j++) {
      const note = ch.notes[j] as Record<string, unknown>
      if (note.pitch !== null && (typeof note.pitch !== 'string' || !PITCH_REGEX.test(note.pitch)))
        errors.push(`channels[${i}].notes[${j}].pitch invalid: '${note.pitch}'`)
      if (!VALID_DURATIONS.includes(note.duration as string))
        errors.push(`channels[${i}].notes[${j}].duration invalid: '${note.duration}'`)
    }
  }

  if (def.variations !== undefined && Array.isArray(def.variations)) {
    for (let i = 0; i < def.variations.length; i++) {
      const v = def.variations[i] as Record<string, unknown>
      if (typeof v.name !== 'string') errors.push(`variations[${i}].name must be string`)
      if (Array.isArray(v.layers) && v.layers.length !== def.channels.length)
        errors.push(`variations[${i}].layers length mismatch`)
    }
  }

  return { valid: errors.length === 0, errors }
}

// --- Inlined composition rules (from compose/rules.md) ---

const RULES = `# 8bit Sound Engine — Composition Rules

You are a chiptune music composer. Given a text prompt, generate a BGMDefinition JSON object.

## BGMDefinition JSON Schema

type WaveType = 'square' | 'triangle' | 'sawtooth'

interface NoteEvent { pitch: string | null; duration: string }
// pitch: 'C4', 'F#5', 'Bb3', or null for rest
// duration: '1n', '2n', '4n', '8n', '16n', '32n'

interface ChannelDefinition {
  wave: WaveType; label?: string; volume?: number; pan?: number; notes: NoteEvent[]
}

interface Variation { name: string; layers: boolean[] }

interface BGMDefinition {
  bpm: number; loop: boolean; channels: ChannelDefinition[]; variations?: Variation[]
}

## Hard Constraints
- BPM: 40-240
- Channels: 2-4
- Pitch: single note names ONLY — C, D, E, F, G, A, B + optional # or b + octave 1-8. Examples: C4, F#5, Bb3, G2. NEVER use chord names (Am, Cm, Dm are INVALID)
- Durations: '1n', '2n', '4n', '8n', '16n', '32n'
- Waves: 'square', 'triangle', 'sawtooth' (NO noise in BGM)
- Notes per channel: 16-96
- loop: always true
- All channels MUST have same total duration
- Volume: melody 0.25-0.4, bass 0.3-0.45, harmony 0.08-0.15, rhythm 0.1-0.2
- Pan: -0.3 to 0.3

## Composition Principles
1. SHORT MOTIFS (4-8 notes) repeated with variation. Never scale runs.
2. Maximize contrast: change tempo, wave types, rhythm, bass, key simultaneously.
3. Wave diversity: triangle=warm/bass, square=bright/melody, sawtooth=rich/harmony. Use DIFFERENT waves per channel.
4. Bass patterns: walking 8ths=energetic, long notes=calm, octave pumping=intense, chromatic=dark.
5. Include rests (null pitch) — minimum 10% of notes. Sparse > busy.
6. Major keys=bright/happy, Minor keys=dark/mysterious.

## Variations
- Always include FULL + at least 2 thematic variations + SOLO
- Name thematically (GHOST, CHARGE, CAMPFIRE — not VARIATION_1)

## Output
Return ONLY valid JSON. No markdown, no code fences, no explanation.
Include _meta field: { title: "2-4 Word Title", tags: ["mood1", "mood2", "usecase"] }

## Remix Mode
When base BGMDefinition provided: preserve structure, modify per prompt.`

// --- Compact examples (prompt → structure description, not full note data) ---

const EXAMPLES_TEXT = `
## Example Compositions

### Example 1: Office / City
Prompt: "bustling city office morning, DQ town style, energetic walking bass"
- BPM: 144, Key: Bb major
- Channel 1: triangle melody (0.35 vol, +0.25 pan) — 8-bar rising triad motif (Bb-D-F), repeated with variation
- Channel 2: triangle walking bass (0.3 vol, -0.25 pan) — 8th note walking patterns
- Channel 3: sawtooth harmony (0.12 vol, -0.3 pan) — whole note chord pads
- Channel 4: square rhythm (0.15 vol, +0.1 pan) — staccato percussive on beat
- Variations: FULL, HUSTLE(bass+rhythm), FOCUS(melody+harmony), COFFEE(melody+bass), ELEVATOR(harmony+rhythm), SOLO

### Example 2: Nature / Adventure
Prompt: "calm nature afternoon, Animal Crossing style, slow spacious cozy"
- BPM: 92, Key: G major
- Channel 1: square melody (0.25 vol, -0.2 pan) — very sparse staccato, 8th notes with rests
- Channel 2: triangle bass (0.35 vol, +0.2 pan) — whole note root movement
- Channel 3: sawtooth harmony (0.10 vol, +0.3 pan) — dreamy sustained pads
- Channel 4: triangle arpeggio (0.15 vol, -0.15 pan) — gentle 8th note arpeggios
- Variations: FULL, RIVERSIDE, FIREFLY, CAMPFIRE, RAIN, SOLO

### Example 3: Battle
Prompt: "intense fast-paced combat, driving rhythm, rapid arpeggios"
- BPM: 180, Key: E minor
- Channel 1: square melody (0.5 vol) — dense 8th/16th runs, repeated note bursts
- Channel 2: triangle bass (0.45 vol) — pumping octave 8th note patterns
- Variations: FULL, CHARGE(melody), RUMBLE(bass)

### Example 4: Dungeon
Prompt: "dark mysterious dungeon, sparse melody, chromatic movement, eerie"
- BPM: 80, Key: D minor
- Channel 1: square melody duty=0.25 (0.4 vol) — very sparse, long rests, chromatic descents (A-G#-G-F)
- Channel 2: triangle bass (0.35 vol) — ominous drone, slow half/whole notes with silence
- Variations: FULL, GHOST(melody), ABYSS(bass)
`

// --- Handler ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Rate limit
    const admin = isAdmin(req)
    if (!admin) {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
      if (!(await checkRateLimit(ip))) {
        return res.status(429).json({ error: 'Rate limited. Max 5 compositions per hour.' })
      }
    }

    // Validate input
    const { prompt, base } = req.body
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required' })
    }
    if (prompt.length > 500) {
      return res.status(400).json({ error: 'prompt too long (max 500 chars)' })
    }

    // Build Claude messages
    const systemPrompt = RULES + '\n' + EXAMPLES_TEXT

    let userMessage = `Compose an 8-bit BGM for: "${prompt}"\n\n`
    if (base) {
      userMessage += `Remix this base song (modify according to the prompt above):\n${JSON.stringify(base)}\n\n`
    }
    userMessage += 'Return ONLY the BGMDefinition JSON with a _meta field containing title and tags. No markdown, no code fences.'

    // Call Claude
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    // Extract JSON from response
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse composition output' })
    }

    let parsed: any
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return res.status(500).json({ error: 'Invalid JSON from AI' })
    }

    // Extract _meta
    const metaRaw = parsed._meta || { title: 'Untitled', tags: [] }
    delete parsed._meta

    // Validate
    const validation = validateBGMDefinition(parsed)
    if (!validation.valid) {
      return res.status(500).json({ error: 'Validation failed', details: validation.errors })
    }

    // Save to KV
    const id = generateId()
    const meta = {
      id,
      title: metaRaw.title || 'Untitled',
      prompt,
      basedOn: base ? 'remix' : undefined,
      tags: Array.isArray(metaRaw.tags) ? metaRaw.tags : [],
      createdAt: new Date().toISOString(),
      isPreset: false,
    }

    await kv.set(`songs:${id}`, { definition: parsed, meta })
    const index: string[] = (await kv.get<string[]>('songs:index')) || []
    index.unshift(id)
    await kv.set('songs:index', index)

    res.status(201).json({ id, definition: parsed, meta })
  } catch (err: any) {
    console.error('compose error:', err)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
