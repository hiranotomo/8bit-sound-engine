import { BGMDefinition } from '../../src/types'

/**
 * Office / City Theme — StillHired
 * Key: C major, BPM: 118
 * Modern, minimal — short motif with space to breathe
 * Sawtooth melody for warm synth feel
 */
export const office: BGMDefinition = {
  bpm: 118,
  loop: true,
  channels: [
    // Melody — sawtooth
    {
      wave: 'sawtooth',
      volume: 0.22,
      notes: [
        // A: 4-note hook
        { pitch: 'E5', duration: '4n' },
        { pitch: 'G5', duration: '4n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'G5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'C5', duration: '2n' },

        // A': hook variation
        { pitch: 'E5', duration: '4n' },
        { pitch: 'G5', duration: '4n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'B5', duration: '4n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'G5', duration: '4n' },
        { pitch: 'E5', duration: '2n' },

        // B: contrast — stepwise, gentle
        { pitch: 'C5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'E5', duration: '2n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'C5', duration: '4n' },
        { pitch: 'B4', duration: '2n' },

        // Outro: space
        { pitch: 'C5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },
        { pitch: 'G5', duration: '2n' },
        { pitch: null, duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    },
    // Bass — triangle
    {
      wave: 'triangle',
      volume: 0.35,
      notes: [
        // A
        { pitch: 'C3', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'C3', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'A2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'A2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // A'
        { pitch: 'C3', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'C3', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // B
        { pitch: 'F2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'F2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Outro
        { pitch: 'A2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'E2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'C3', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    }
  ]
}
