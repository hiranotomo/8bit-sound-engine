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
  variations: [
    { name: 'FULL',      layers: [true,  true,  true,  true]  },
    { name: 'RIVERSIDE', layers: [false, true,  true,  true]  },
    { name: 'FIREFLY',   layers: [true,  false, true,  false] },
    { name: 'CAMPFIRE',  layers: [true,  true,  false, false] },
    { name: 'RAIN',      layers: [false, false, true,  true]  },
    { name: 'SOLO',      layers: [true,  false, false, false] },
  ],
  channels: [
    // Melody — square (staccato, piano-like, soft) — slightly left
    {
      wave: 'square',
      label: 'melody',
      volume: 0.25,
      pan: -0.2,
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
    // Bass — triangle (long, warm, spacious) — slightly right
    {
      wave: 'triangle',
      label: 'bass',
      volume: 0.35,
      pan: 0.2,
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
    },
    // Harmony — sawtooth (dreamy pad, very soft) — right of center
    {
      wave: 'sawtooth',
      label: 'harmony',
      volume: 0.10,
      pan: 0.3,
      notes: [
        // Bar 1: G — 3rd
        { pitch: 'B3', duration: '1n' },

        // Bar 2: C — 3rd
        { pitch: 'E4', duration: '1n' },

        // Bar 3: G — 5th
        { pitch: 'D4', duration: '1n' },

        // Bar 4: Em → D
        { pitch: 'G3', duration: '2n' },
        { pitch: 'F#3', duration: '2n' },

        // Bar 5: C — 3rd
        { pitch: 'E4', duration: '1n' },

        // Bar 6: Am → G
        { pitch: 'C4', duration: '2n' },
        { pitch: 'B3', duration: '2n' },

        // Bar 7: D — 3rd
        { pitch: 'F#4', duration: '1n' },

        // Bar 8: G — settle
        { pitch: 'B3', duration: '2n' },
        { pitch: 'D4', duration: '2n' },
      ]
    },
    // Arpeggio — triangle (gentle music-box texture) — slightly left
    {
      wave: 'triangle',
      label: 'arpeggio',
      volume: 0.15,
      pan: -0.15,
      notes: [
        // Bar 1: G arpeggio — ascending/descending
        { pitch: 'G4', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '8n' },

        // Bar 2: C arpeggio
        { pitch: 'C4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'C4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },

        // Bar 3: G arpeggio
        { pitch: 'G4', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '8n' },

        // Bar 4: Em → D
        { pitch: 'E4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'D4', duration: '8n' },
        { pitch: 'F#4', duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'F#4', duration: '8n' },

        // Bar 5: C arpeggio
        { pitch: 'C4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'C4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },

        // Bar 6: Am → G
        { pitch: 'A3', duration: '8n' },
        { pitch: 'C4', duration: '8n' },
        { pitch: 'E4', duration: '8n' },
        { pitch: 'C4', duration: '8n' },
        { pitch: 'G3', duration: '8n' },
        { pitch: 'B3', duration: '8n' },
        { pitch: 'D4', duration: '8n' },
        { pitch: 'B3', duration: '8n' },

        // Bar 7: D arpeggio
        { pitch: 'D4', duration: '8n' },
        { pitch: 'F#4', duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'F#4', duration: '8n' },
        { pitch: 'D4', duration: '8n' },
        { pitch: 'F#4', duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'F#4', duration: '8n' },

        // Bar 8: G arpeggio — descending to resolve
        { pitch: 'G3', duration: '8n' },
        { pitch: 'B3', duration: '8n' },
        { pitch: 'D4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'D4', duration: '8n' },
        { pitch: 'B3', duration: '8n' },
        { pitch: 'G3', duration: '8n' },
        { pitch: null, duration: '8n' },
      ]
    }
  ]
}
