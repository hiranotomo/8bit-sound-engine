import type { VercelRequest } from '@vercel/node'

export function isAdmin(req: VercelRequest): boolean {
  const auth = req.headers.authorization
  return auth === `Bearer ${process.env.ADMIN_KEY}`
}
