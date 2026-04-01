// src/types.ts
export type WaveType = 'square' | 'triangle' | 'sawtooth' | 'noise'

export interface NoteEvent {
  pitch: string | null
  duration: string
}

export interface ChannelDefinition {
  wave: WaveType
  label?: string    // e.g. 'melody', 'bass', 'harmony', 'rhythm'
  duty?: number
  volume?: number
  pan?: number  // -1 (left) to 1 (right), default 0
  notes: NoteEvent[]
}

export interface Variation {
  name: string
  layers: boolean[]  // which channels are active
}

export interface BGMDefinition {
  bpm: number
  loop?: boolean
  channels: ChannelDefinition[]
  variations?: Variation[]  // named arrangement presets
}

export interface SEDefinition {
  wave: WaveType
  notes: NoteEvent[]
  volume?: number
}
