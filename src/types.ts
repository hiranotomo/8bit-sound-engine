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
  pan?: number      // -1 (left) to 1 (right), default 0
  attack?: number   // seconds, note fade-in (0.001=sharp, 0.15=slow pad). default 0.01
  release?: number  // seconds, note fade-out (0.01=staccato, 0.3=legato). default 0.05
  detune?: number   // cents, adds a 2nd detuned oscillator for thickness (0=off, 8-15=chorus). default 0
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
