import { SEDefinition } from '../types'

export const SE_PRESETS: Record<string, SEDefinition> = {
  jump: {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'C4', duration: '32n' },
      { pitch: 'E4', duration: '32n' },
      { pitch: 'G4', duration: '32n' },
      { pitch: 'C5', duration: '16n' },
    ]
  },
  coin: {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'E5', duration: '16n' },
      { pitch: 'B5', duration: '8n' },
    ]
  },
  damage: {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'E5', duration: '32n' },
      { pitch: 'B4', duration: '32n' },
      { pitch: 'G4', duration: '32n' },
      { pitch: 'E4', duration: '16n' },
      { pitch: 'C4', duration: '16n' },
    ]
  },
  powerup: {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'C4', duration: '32n' },
      { pitch: 'D4', duration: '32n' },
      { pitch: 'E4', duration: '32n' },
      { pitch: 'F4', duration: '32n' },
      { pitch: 'G4', duration: '32n' },
      { pitch: 'A4', duration: '32n' },
      { pitch: 'B4', duration: '32n' },
      { pitch: 'C5', duration: '16n' },
    ]
  },
  gameover: {
    wave: 'triangle',
    volume: 0.7,
    notes: [
      { pitch: 'E4', duration: '8n' },
      { pitch: 'C4', duration: '8n' },
      { pitch: 'A3', duration: '8n' },
      { pitch: null, duration: '8n' },
      { pitch: 'A3', duration: '4n' },
    ]
  },
  select: {
    wave: 'square',
    volume: 0.4,
    notes: [
      { pitch: 'A4', duration: '32n' },
      { pitch: 'A5', duration: '16n' },
    ]
  },
  cancel: {
    wave: 'square',
    volume: 0.4,
    notes: [
      { pitch: 'A4', duration: '32n' },
      { pitch: 'E4', duration: '16n' },
    ]
  },
  explosion: {
    wave: 'noise',
    volume: 0.7,
    notes: [
      { pitch: 'G3', duration: '16n' },
      { pitch: 'C3', duration: '8n' },
      { pitch: 'C2', duration: '8n' },
      { pitch: 'C1', duration: '4n' },
    ]
  },
  laser: {
    wave: 'square',
    volume: 0.4,
    notes: [
      { pitch: 'C6', duration: '32n' },
      { pitch: 'G5', duration: '32n' },
      { pitch: 'C5', duration: '32n' },
    ]
  },
  '1up': {
    wave: 'square',
    volume: 0.5,
    notes: [
      { pitch: 'E4', duration: '16n' },
      { pitch: 'G4', duration: '16n' },
      { pitch: 'E5', duration: '16n' },
      { pitch: 'C5', duration: '16n' },
      { pitch: 'D5', duration: '16n' },
      { pitch: 'G5', duration: '8n' },
    ]
  }
}
