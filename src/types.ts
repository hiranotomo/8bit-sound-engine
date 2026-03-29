// src/types.ts
export type WaveType = 'square' | 'triangle' | 'noise'

export interface NoteEvent {
  pitch: string | null
  duration: string
}

export interface ChannelDefinition {
  wave: WaveType
  duty?: number
  volume?: number
  notes: NoteEvent[]
}

export interface BGMDefinition {
  bpm: number
  loop?: boolean
  channels: ChannelDefinition[]
}

export interface SEDefinition {
  wave: WaveType
  notes: NoteEvent[]
  volume?: number
}
