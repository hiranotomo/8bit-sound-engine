import { BGMDefinition } from '../../src/types'

/**
 * Nature / Life Restart Theme — StillHired
 * Key: G major, BPM: 92
 * Animal Crossing inspired — slow, spacious, cozy afternoon
 * Square staccato melody, triangle long-note bass
 * CONTRAST with Office: slower, more space, longer notes, dreamy
 */
export const nature: BGMDefinition = {
  bpm: 92,
  loop: true,
  channels: [
    // Melody — square (staccato, piano-like, soft)
    {
      wave: 'square',
      volume: 0.25,
      notes: [
        // A: Gentle, spacious — like sitting by a river
        // Bar 1
        { pitch: 'G4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D5', duration: '2n' },

        // Bar 2: Float
        { pitch: 'E5', duration: '2n' },
        { pitch: 'D5', duration: '2n' },

        // Bar 3: Motif again
        { pitch: 'G4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D5', duration: '2n' },

        // Bar 4: Higher, then rest — big breath
        { pitch: 'G5', duration: '2n' },
        { pitch: null, duration: '2n' },

        // B: Wander — afternoon exploration
        // Bar 5
        { pitch: 'C5', duration: '2n' },
        { pitch: 'E5', duration: '2n' },

        // Bar 6
        { pitch: 'D5', duration: '2n' },
        { pitch: 'B4', duration: '2n' },

        // Bar 7: Coming home
        { pitch: 'A4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'C5', duration: '2n' },

        // Bar 8: Settle + long breath
        { pitch: 'B4', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    },
    // Bass — triangle (long, warm, spacious — opposite of Office's walking bass)
    {
      wave: 'triangle',
      volume: 0.35,
      notes: [
        // Bar 1: G
        { pitch: 'G2', duration: '1n' },

        // Bar 2: C
        { pitch: 'C3', duration: '1n' },

        // Bar 3: G
        { pitch: 'G2', duration: '1n' },

        // Bar 4: Em
        { pitch: 'E2', duration: '2n' },
        { pitch: 'D2', duration: '2n' },

        // Bar 5: C
        { pitch: 'C3', duration: '1n' },

        // Bar 6: Am → G
        { pitch: 'A2', duration: '2n' },
        { pitch: 'G2', duration: '2n' },

        // Bar 7: D
        { pitch: 'D2', duration: '1n' },

        // Bar 8: G
        { pitch: 'G2', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    }
  ]
}
