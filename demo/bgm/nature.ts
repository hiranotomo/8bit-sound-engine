import { BGMDefinition } from '../../src/types'

/**
 * Nature / Adventure Theme — StillHired
 * Key: D major, BPM: 108
 * Open, hopeful, flowing — pentatonic melody with wide leaps
 * Sawtooth melody for warmth
 */
export const nature: BGMDefinition = {
  bpm: 108,
  loop: true,
  channels: [
    // Melody — sawtooth
    {
      wave: 'sawtooth',
      volume: 0.22,
      notes: [
        // A: open fifth leap — the "setting out" motif
        { pitch: 'D5', duration: '2n' },
        { pitch: 'A5', duration: '2n' },
        { pitch: 'G5', duration: '4n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'D5', duration: '2n' },

        // A': same start, different resolution
        { pitch: 'D5', duration: '2n' },
        { pitch: 'A5', duration: '2n' },
        { pitch: 'B5', duration: '4n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'G5', duration: '2n' },

        // B: descending — peaceful valley
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },
        { pitch: 'D5', duration: '2n' },
        { pitch: 'E5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'A4', duration: '2n' },

        // Outro: breath before loop
        { pitch: 'D5', duration: '2n' },
        { pitch: null, duration: '2n' },
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
        { pitch: 'D2', duration: '2n' },
        { pitch: 'D3', duration: '2n' },
        { pitch: 'G2', duration: '2n' },
        { pitch: 'A2', duration: '2n' },

        // A'
        { pitch: 'D2', duration: '2n' },
        { pitch: 'D3', duration: '2n' },
        { pitch: 'G2', duration: '2n' },
        { pitch: 'E2', duration: '2n' },

        // B
        { pitch: 'B2', duration: '2n' },
        { pitch: 'A2', duration: '2n' },
        { pitch: 'G2', duration: '2n' },
        { pitch: 'A2', duration: '2n' },

        // Outro
        { pitch: 'D2', duration: '2n' },
        { pitch: 'A2', duration: '2n' },
        { pitch: 'D3', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    }
  ]
}
