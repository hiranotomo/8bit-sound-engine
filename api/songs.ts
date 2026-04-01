import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { SongMeta, StoredSong } from './_lib/types'

// Lazy-loaded modules to avoid static import issues in Vercel
async function getKv() {
  const { kv } = await import('./_lib/kv')
  return kv
}

async function getHelpers() {
  const { generateId } = await import('./_lib/id')
  const { isAdmin } = await import('./_lib/auth')
  const { checkRateLimit } = await import('./_lib/ratelimit')
  return { generateId, isAdmin, checkRateLimit }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      return await handleList(req, res)
    }
    if (req.method === 'POST') {
      return await handleCreate(req, res)
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err: any) {
    console.error('songs handler error:', err)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
}

async function handleList(req: VercelRequest, res: VercelResponse) {
  const kv = await getKv()
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
  const kv = await getKv()
  const { generateId, isAdmin, checkRateLimit } = await getHelpers()
  const admin = isAdmin(req)

  if (!admin) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
    const allowed = await checkRateLimit(ip)
    if (!allowed) {
      return res.status(429).json({ error: 'Rate limited. Try again later.' })
    }
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
    isPreset: admin ? (isPreset || false) : false,
  }

  const stored: StoredSong = { definition, meta }
  await kv.set(`songs:${id}`, stored)

  const index: string[] = (await kv.get<string[]>('songs:index')) || []
  index.unshift(id)
  await kv.set('songs:index', index)

  if (admin && isPreset) {
    const presets: string[] = (await kv.get<string[]>('presets')) || []
    presets.push(id)
    await kv.set('presets', presets)
  }

  res.status(201).json({ id, url: `/s/${id}` })
}
