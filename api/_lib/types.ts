import type { BGMDefinition } from '../../src/types'

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
  definition: BGMDefinition
  meta: SongMeta
}
