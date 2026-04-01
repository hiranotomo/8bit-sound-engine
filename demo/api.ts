import type { BGMDefinition } from '../src/types'

const BASE = '/api'

export interface SongListItem {
  id: string
  title: string
  composer?: string
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
  definition: BGMDefinition
  suggestedMeta: {
    title: string
    tags: string[]
    prompt: string
    basedOn?: string
  }
  remaining: number
}

export interface SaveSongRequest {
  title: string
  composer: string
  prompt: string
  tags: string[]
  definition: BGMDefinition
  basedOn?: string
}

export async function saveSong(request: SaveSongRequest): Promise<{ id: string; url: string }> {
  const res = await fetch(`${BASE}/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Save failed: ${res.status}`)
  }
  return res.json()
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
