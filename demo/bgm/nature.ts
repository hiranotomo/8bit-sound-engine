import { BGMDefinition } from '../../src/types'

/**
 * Nature / Life Restart Theme — StillHired
 * Key: G major, BPM: 104
 * Animal Crossing inspired — relaxed, jazzy, cozy
 * Square wave staccato melody (piano-like), triangle bass (round, warm)
 * Short bouncy phrases with swing feel via 8th note patterns
 */
export const nature: BGMDefinition = {
  bpm: 104,
  loop: true,
  channels: [
    // Melody — square (staccato piano-like, AC style)
    {
      wave: 'square',
      volume: 0.3,
      notes: [
        // A: Bouncy, cheerful motif — think AC hourly music
        // Bar 1: The hook — G-B-D with a jazzy E
        { pitch: 'G4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },

        // Bar 2: Answer — gentle descent
        { pitch: 'D5', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A4', duration: '2n' },

        // Bar 3: Repeat hook, reach higher
        { pitch: 'G4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'G5', duration: '4n' },

        // Bar 4: Resolve with a smile
        { pitch: 'F#5', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D5', duration: '2n' },

        // B: Softer, wandering — afternoon stroll
        // Bar 5: New color — C major area
        { pitch: 'C5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'C5', duration: '4n' },

        // Bar 6: Drift back
        { pitch: 'B4', duration: '4n' },
        { pitch: 'A4', duration: '4n' },
        { pitch: 'G4', duration: '2n' },

        // Bar 7: Little pickup
        { pitch: 'A4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'C5', duration: '4n' },
        { pitch: 'B4', duration: '4n' },

        // Bar 8: Home + breathe
        { pitch: 'G4', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    },
    // Bass — triangle (round, bouncy)
    {
      wave: 'triangle',
      volume: 0.35,
      notes: [
        // A
        // Bar 1: G
        { pitch: 'G2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'B2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 2: C → D
        { pitch: 'C3', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 3: G
        { pitch: 'G2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'B2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 4: Em → D
        { pitch: 'E2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'D2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // B
        // Bar 5: C
        { pitch: 'C3', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'C3', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 6: Am → G
        { pitch: 'A2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G2', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 7: D
        { pitch: 'D2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 8: G
        { pitch: 'G2', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    }
  ]
}
