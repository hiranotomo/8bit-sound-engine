import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '../_lib/kv'
import type { StoredSong } from '../_lib/types'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid id' })
  }

  const stored = await kv.get<StoredSong>(`songs:${id}`)
  if (!stored) {
    return res.status(404).json({ error: 'Song not found' })
  }

  res.json({ definition: stored.definition, meta: stored.meta })
}
