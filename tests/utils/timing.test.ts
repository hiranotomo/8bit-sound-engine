import { describe, it, expect } from 'vitest'
import { durationToSeconds } from '../../src/utils/timing'

describe('durationToSeconds', () => {
  it('converts whole note at 120bpm to 2s', () => {
    expect(durationToSeconds('1n', 120)).toBeCloseTo(2.0)
  })
  it('converts quarter note at 120bpm to 0.5s', () => {
    expect(durationToSeconds('4n', 120)).toBeCloseTo(0.5)
  })
  it('converts 8th note at 120bpm to 0.25s', () => {
    expect(durationToSeconds('8n', 120)).toBeCloseTo(0.25)
  })
  it('converts 16th note at 140bpm', () => {
    expect(durationToSeconds('16n', 140)).toBeCloseTo(60 / 140 / 4)
  })
})
