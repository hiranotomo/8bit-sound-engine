import { BGMDefinition } from '../../src/types'

/**
 * Office / City Theme — StillHired
 * Key: Bb major, BPM: 112, 8 bars (A4 + A'4)
 * Dragon Quest town style — warm, gentle, singable
 * Triangle wave melody + triangle bass for soft, recorder-like tone
 */
export const office: BGMDefinition = {
  bpm: 138,
  loop: true,
  channels: [
    // Melody — triangle (warm, recorder-like)
    {
      wave: 'triangle',
      volume: 0.35,
      notes: [
        // === A section (bars 1–4) ===

        // Bar 1: Motif — rising Bb triad (singable hook)
        { pitch: 'Bb4', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'F5', duration: '2n' },

        // Bar 2: Gentle stepwise descent
        { pitch: 'Eb5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'C5', duration: '4n' },
        { pitch: 'Bb4', duration: '4n' },

        // Bar 3: Motif again, reaching higher
        { pitch: 'Bb4', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'F5', duration: '4n' },
        { pitch: 'G5', duration: '4n' },

        // Bar 4: Resolve + breathe
        { pitch: 'F5', duration: '2n' },
        { pitch: null, duration: '2n' },

        // === A' section (bars 5–8) ===

        // Bar 5: Same motif (familiar comfort)
        { pitch: 'Bb4', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'F5', duration: '2n' },

        // Bar 6: New answer — descending from G5 (bittersweet vi touch)
        { pitch: 'G5', duration: '4n' },
        { pitch: 'F5', duration: '4n' },
        { pitch: 'Eb5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },

        // Bar 7: Passing through ii–V
        { pitch: 'Eb5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'C5', duration: '4n' },
        { pitch: 'A4', duration: '4n' },

        // Bar 8: Home — warm resolution + rest for loop
        { pitch: 'Bb4', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    },
    // Bass — triangle (round, supportive)
    {
      wave: 'triangle',
      volume: 0.3,
      notes: [
        // === A section (bars 1–4) ===

        // Bar 1: Bb (I)
        { pitch: 'Bb2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'Bb2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 2: Eb (IV)
        { pitch: 'Eb2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'Eb2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 3: Bb (I) → D passing tone (iii feel)
        { pitch: 'Bb2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 4: F (V)
        { pitch: 'F2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'F2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // === A' section (bars 5–8) ===

        // Bar 5: Bb (I)
        { pitch: 'Bb2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'Bb2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 6: Eb (IV) → G (vi — bittersweet touch)
        { pitch: 'Eb2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 7: C (ii) → F (V)
        { pitch: 'C3', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'F2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 8: Bb (I) — home
        { pitch: 'Bb2', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    }
  ]
}
