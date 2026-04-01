import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from './_kv'
import { isAdmin } from './_auth'
import type { StoredSong } from './_types'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const presets: string[] = (await kv.get<string[]>('presets')) || []
    return res.json({ presets })
  }

  if (req.method === 'PUT') {
    if (!isAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { ids } = req.body
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' })
    }

    // Get current presets to diff
    const oldPresets: string[] = (await kv.get<string[]>('presets')) || []
    const newSet = new Set(ids)
    const oldSet = new Set(oldPresets)

    // Update isPreset flag on affected songs
    for (const id of ids) {
      if (!oldSet.has(id)) {
        const song = await kv.get<StoredSong>(`songs:${id}`)
        if (song) {
          song.meta.isPreset = true
          await kv.set(`songs:${id}`, song)
        }
      }
    }
    for (const id of oldPresets) {
      if (!newSet.has(id)) {
        const song = await kv.get<StoredSong>(`songs:${id}`)
        if (song) {
          song.meta.isPreset = false
          await kv.set(`songs:${id}`, song)
        }
      }
    }

    await kv.set('presets', ids)
    return res.json({ presets: ids })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
