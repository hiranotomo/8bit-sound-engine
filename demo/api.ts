import type { BGMDefinition } from '../src/types'

const BASE = '/api'

export interface SongListItem {
  id: string
  title: string
  tags: string[]
  isPreset: boolean
  createdAt: string
}

export interface SongDetail {
  definition: BGMDefinition
  meta: SongListItem
}

export async function fetchSongs(preset?: boolean): Promise<SongListItem[]> {
  const url = preset !== undefined ? `${BASE}/songs?preset=${preset}` : `${BASE}/songs`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch songs: ${res.status}`)
  const data = await res.json()
  return data.songs
}

export async function fetchSong(id: string): Promise<SongDetail> {
  const res = await fetch(`${BASE}/songs/${id}`)
  if (!res.ok) throw new Error(`Song not found: ${id}`)
  return res.json()
}

export interface ComposeRequest {
  prompt: string
  base?: BGMDefinition
}

export interface ComposeResponse {
  id: string
  definition: BGMDefinition
  meta: SongListItem
}

export async function composeSong(request: ComposeRequest): Promise<ComposeResponse> {
  const res = await fetch(`${BASE}/compose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Compose failed: ${res.status}`)
  }
  return res.json()
}
