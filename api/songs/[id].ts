import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

interface SongMeta {
  id: string; title: string; prompt: string; basedOn?: string
  tags: string[]; createdAt: string; isPreset: boolean
}
interface StoredSong { definition: Record<string, unknown>; meta: SongMeta }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

    const { id } = req.query
    if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' })

    const stored = await kv.get<StoredSong>(`songs:${id}`)
    if (!stored) return res.status(404).json({ error: 'Song not found' })

    res.json({ definition: stored.definition, meta: stored.meta })
  } catch (err: any) {
    console.error('songs/[id] error:', err)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
