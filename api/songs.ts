import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from './_lib/kv'
import { generateId } from './_lib/id'
import type { SongMeta, StoredSong } from './_lib/types'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return handleList(req, res)
  }
  if (req.method === 'POST') {
    return handleCreate(req, res)
  }
  res.status(405).json({ error: 'Method not allowed' })
}

async function handleList(req: VercelRequest, res: VercelResponse) {
  const presetFilter = req.query.preset

  const index: string[] = (await kv.get<string[]>('songs:index')) || []
  const presetIds: string[] = (await kv.get<string[]>('presets')) || []
  const presetSet = new Set(presetIds)

  const songs: SongMeta[] = []
  for (const id of index) {
    const stored = await kv.get<StoredSong>(`songs:${id}`)
    if (!stored) continue

    const isPreset = presetSet.has(id)
    if (presetFilter === 'true' && !isPreset) continue
    if (presetFilter === 'false' && isPreset) continue

    songs.push({ ...stored.meta, isPreset })
  }

  res.json({ songs })
}

async function handleCreate(req: VercelRequest, res: VercelResponse) {
  const adminKey = process.env.ADMIN_KEY
  const auth = req.headers.authorization
  if (auth !== `Bearer ${adminKey}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { title, prompt, tags, definition, isPreset, basedOn } = req.body
  if (!title || !definition) {
    return res.status(400).json({ error: 'title and definition are required' })
  }

  const id = generateId()
  const meta: SongMeta = {
    id,
    title,
    prompt: prompt || '',
    basedOn,
    tags: tags || [],
    createdAt: new Date().toISOString(),
    isPreset: isPreset || false,
  }

  const stored: StoredSong = { definition, meta }
  await kv.set(`songs:${id}`, stored)

  // Add to index (newest first)
  const index: string[] = (await kv.get<string[]>('songs:index')) || []
  index.unshift(id)
  await kv.set('songs:index', index)

  // Add to presets if flagged
  if (isPreset) {
    const presets: string[] = (await kv.get<string[]>('presets')) || []
    presets.push(id)
    await kv.set('presets', presets)
  }

  res.status(201).json({ id, url: `/s/${id}` })
}
