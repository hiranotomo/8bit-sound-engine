import { BGMDefinition } from '../../src/types'

/**
 * Office / City Theme — StillHired
 * Key: Bb major, BPM: 144
 * DQ town style — bustling, energetic walking bass, busy city morning
 * Triangle melody + triangle walking bass (8th notes)
 */
export const office: BGMDefinition = {
  bpm: 144,
  loop: true,
  channels: [
    // Melody — triangle (warm, recorder-like)
    {
      wave: 'triangle',
      volume: 0.35,
      notes: [
        // A: Rising triad hook — quick, energetic
        // Bar 1
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'F5', duration: '4n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'F5', duration: '8n' },

        // Bar 2
        { pitch: 'Eb5', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'C5', duration: '4n' },
        { pitch: 'Bb4', duration: '4n' },

        // Bar 3: Motif again, higher
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'F5', duration: '8n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'Bb5', duration: '4n' },

        // Bar 4: Quick resolve
        { pitch: 'A5', duration: '8n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'F5', duration: '2n' },

        // A': Variation
        // Bar 5
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'F5', duration: '4n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'F5', duration: '8n' },

        // Bar 6: Bittersweet turn
        { pitch: 'G5', duration: '4n' },
        { pitch: 'F5', duration: '4n' },
        { pitch: 'Eb5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },

        // Bar 7: Walking down through ii-V
        { pitch: 'Eb5', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'C5', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'A4', duration: '4n' },
        { pitch: 'Bb4', duration: '4n' },

        // Bar 8: Home + breathe
        { pitch: 'Bb4', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: null, duration: '2n' },
      ]
    },
    // Bass — triangle WALKING bass (8th notes — busy, DQ city feel)
    {
      wave: 'triangle',
      volume: 0.3,
      notes: [
        // Bar 1: Bb (I)
        { pitch: 'Bb2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F2', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },
        { pitch: 'F2', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },

        // Bar 2: Eb (IV)
        { pitch: 'Eb2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },
        { pitch: 'Eb2', duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: 'Eb2', duration: '8n' },
        { pitch: 'F2', duration: '8n' },
        { pitch: 'G2', duration: '8n' },

        // Bar 3: Bb (I)
        { pitch: 'Bb2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F2', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'F3', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },

        // Bar 4: F (V)
        { pitch: 'F2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: 'F2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 5: Bb (I)
        { pitch: 'Bb2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F2', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },
        { pitch: 'F2', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },

        // Bar 6: Eb (IV) → G (vi)
        { pitch: 'Eb2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: 'Bb2', duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D2', duration: '8n' },
        { pitch: 'G2', duration: '8n' },

        // Bar 7: Cm (ii) → F (V)
        { pitch: 'C2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Eb2', duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: 'F2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: 'C3', duration: '8n' },

        // Bar 8: Bb (I) — home
        { pitch: 'Bb2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: null, duration: '2n' },
      ]
    }
  ]
}
