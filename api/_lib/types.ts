export interface SongMeta {
  id: string
  title: string
  prompt: string
  basedOn?: string
  tags: string[]
  createdAt: string
  isPreset: boolean
}

export interface StoredSong {
  definition: Record<string, unknown>
  meta: SongMeta
}
