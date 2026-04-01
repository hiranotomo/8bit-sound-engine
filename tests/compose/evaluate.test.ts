import { describe, it, expect } from 'vitest'
import { validateBGMDefinition } from '../../compose/evaluate'

describe('validateBGMDefinition', () => {
  const validMinimal = {
    bpm: 120,
    loop: true,
    channels: [
      {
        wave: 'square',
        volume: 0.3,
        notes: [{ pitch: 'C4', duration: '4n' }],
      },
    ],
  }

  const validFull = {
    bpm: 144,
    loop: true,
    channels: [
      { wave: 'triangle', label: 'melody', volume: 0.35, pan: 0.25, notes: [
        { pitch: 'Bb4', duration: '8n' }, { pitch: 'D5', duration: '8n' }, { pitch: 'F5', duration: '4n' },
      ]},
      { wave: 'triangle', label: 'bass', volume: 0.3, pan: -0.25, notes: [
        { pitch: 'Bb2', duration: '2n' }, { pitch: 'Eb2', duration: '2n' },
      ]},
    ],
    variations: [
      { name: 'FULL', layers: [true, true] },
      { name: 'SOLO', layers: [true, false] },
    ],
  }

  it('accepts valid minimal BGM', () => {
    const result = validateBGMDefinition(validMinimal)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('accepts valid full BGM with variations', () => {
    const result = validateBGMDefinition(validFull)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects null input', () => {
    const result = validateBGMDefinition(null)
    expect(result.valid).toBe(false)
  })

  it('rejects missing channels', () => {
    const result = validateBGMDefinition({ bpm: 120 })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('channels'))).toBe(true)
  })

  it('rejects BPM out of range', () => {
    const result = validateBGMDefinition({ ...validMinimal, bpm: 0 })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('bpm'))).toBe(true)
  })

  it('rejects BPM too high', () => {
    const result = validateBGMDefinition({ ...validMinimal, bpm: 300 })
    expect(result.valid).toBe(false)
  })

  it('rejects invalid pitch', () => {
    const bad = {
      bpm: 120, channels: [{ wave: 'square', notes: [{ pitch: 'Z9', duration: '4n' }] }],
    }
    const result = validateBGMDefinition(bad)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('pitch'))).toBe(true)
  })

  it('rejects invalid duration', () => {
    const bad = {
      bpm: 120, channels: [{ wave: 'square', notes: [{ pitch: 'C4', duration: '3n' }] }],
    }
    const result = validateBGMDefinition(bad)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('duration'))).toBe(true)
  })

  it('rejects too many channels', () => {
    const channels = Array.from({ length: 7 }, () => ({
      wave: 'square', notes: [{ pitch: 'C4', duration: '4n' }],
    }))
    const result = validateBGMDefinition({ bpm: 120, channels })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('at most 6'))).toBe(true)
  })

  it('rejects invalid wave type', () => {
    const bad = {
      bpm: 120, channels: [{ wave: 'sine', notes: [{ pitch: 'C4', duration: '4n' }] }],
    }
    const result = validateBGMDefinition(bad)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('wave'))).toBe(true)
  })

  it('accepts null pitch (rest)', () => {
    const result = validateBGMDefinition({
      bpm: 120, channels: [{ wave: 'square', notes: [{ pitch: null, duration: '4n' }] }],
    })
    expect(result.valid).toBe(true)
  })

  it('rejects variations with wrong layer count', () => {
    const bad = {
      ...validMinimal,
      variations: [{ name: 'FULL', layers: [true, true] }], // 2 layers but 1 channel
    }
    const result = validateBGMDefinition(bad)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('layers length'))).toBe(true)
  })

  it('accepts sharps and flats', () => {
    const result = validateBGMDefinition({
      bpm: 120, channels: [{
        wave: 'triangle', notes: [
          { pitch: 'F#4', duration: '4n' },
          { pitch: 'Bb3', duration: '4n' },
          { pitch: 'C#5', duration: '8n' },
          { pitch: 'Eb4', duration: '8n' },
        ],
      }],
    })
    expect(result.valid).toBe(true)
  })
})
