import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { Redis } = await import('@upstash/redis')
    const kv = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
    const result = await kv.get('songs:index')
    res.json({ ok: true, result, env: { hasUrl: !!process.env.KV_REST_API_URL, hasToken: !!process.env.KV_REST_API_TOKEN } })
  } catch (err: any) {
    res.status(500).json({ error: err.message, stack: err.stack })
  }
}
