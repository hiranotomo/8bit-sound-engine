import { describe, it, expect } from 'vitest'
import { noteToFrequency } from '../../src/utils/note'

describe('noteToFrequency', () => {
  it('converts A4 to 440Hz', () => {
    expect(noteToFrequency('A4')).toBeCloseTo(440)
  })
  it('converts C4 to ~261.63Hz', () => {
    expect(noteToFrequency('C4')).toBeCloseTo(261.63, 1)
  })
  it('returns 0 for null (rest)', () => {
    expect(noteToFrequency(null)).toBe(0)
  })
})
