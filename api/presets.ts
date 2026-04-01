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

function isAdmin(req: VercelRequest): boolean {
  return req.headers.authorization === `Bearer ${process.env.ADMIN_KEY}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const presets: string[] = (await kv.get<string[]>('presets')) || []
      return res.json({ presets })
    }

    if (req.method === 'PUT') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

      const { ids } = req.body
      if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' })

      const oldPresets: string[] = (await kv.get<string[]>('presets')) || []
      const newSet = new Set(ids)
      const oldSet = new Set(oldPresets)

      for (const id of ids) {
        if (!oldSet.has(id)) {
          const song = await kv.get<StoredSong>(`songs:${id}`)
          if (song) { song.meta.isPreset = true; await kv.set(`songs:${id}`, song) }
        }
      }
      for (const id of oldPresets) {
        if (!newSet.has(id)) {
          const song = await kv.get<StoredSong>(`songs:${id}`)
          if (song) { song.meta.isPreset = false; await kv.set(`songs:${id}`, song) }
        }
      }

      await kv.set('presets', ids)
      return res.json({ presets: ids })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err: any) {
    console.error('presets error:', err)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
