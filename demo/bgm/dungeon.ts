import { BGMDefinition } from '../../src/types'

/**
 * Dungeon Theme - Dark, mysterious atmosphere
 * Key: D minor, BPM: 80, 16 bars
 * Sparse melody with chromatic movement, droning bass, eerie silences
 */
export const dungeon: BGMDefinition = {
  bpm: 80,
  loop: true,
  variations: [
    { name: 'FULL',    layers: [true,  true]  },
    { name: 'GHOST',   layers: [true,  false] },
    { name: 'ABYSS',   layers: [false, true]  },
  ],
  channels: [
    // Melody - Triangle wave (thin, ghostly, haunting)
    {
      wave: 'choir',
      label: 'melody',
      volume: 0.3,
      attack: 0.15,
      release: 0.3,
      detune: 8,
      notes: [
        // Bar 1-2: Sparse opening, dripping water feel
        { pitch: null, duration: '4n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: null, duration: '2n' },
        { pitch: null, duration: '4n' },
        { pitch: 'C#5', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: null, duration: '2n' },

        // Bar 3-4: Descending chromatic line
        { pitch: 'A5', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G#5', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G5', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'F5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },

        // Bar 5-6: Eerie melody fragment
        { pitch: 'D5', duration: '2n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'F4', duration: '2n' },
        { pitch: null, duration: '4n' },
        { pitch: 'E4', duration: '4n' },

        // Bar 7-8: Rising tension
        { pitch: 'F4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'C5', duration: '4n' },
        { pitch: 'C#5', duration: '4n' },
        { pitch: 'D5', duration: '2n' },
        { pitch: null, duration: '2n' },

        // Bar 9-10: Ghostly high notes
        { pitch: null, duration: '2n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F5', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: null, duration: '2n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 11-12: Tritone tension
        { pitch: 'D4', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G#4', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'D4', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'G#4', duration: '4n' },
        { pitch: 'A4', duration: '4n' },

        // Bar 13-14: Descending lament
        { pitch: 'D5', duration: '4n' },
        { pitch: 'C5', duration: '4n' },
        { pitch: 'Bb4', duration: '4n' },
        { pitch: 'A4', duration: '4n' },
        { pitch: 'G4', duration: '4n' },
        { pitch: 'F4', duration: '4n' },
        { pitch: 'E4', duration: '2n' },

        // Bar 15-16: Dissolve into silence
        { pitch: 'D4', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'C#4', duration: '8n' },
        { pitch: 'D4', duration: '8n' },
        { pitch: null, duration: '2n' },
        { pitch: null, duration: '1n' },
      ]
    },
    // Bass - Triangle wave (ominous drone)
    {
      wave: 'triangle',
      label: 'bass',
      volume: 0.35,
      notes: [
        // Bar 1-2: Low drone with slow pulse
        { pitch: 'D2', duration: '2n' },
        { pitch: null, duration: '4n' },
        { pitch: 'D2', duration: '4n' },
        { pitch: 'D2', duration: '2n' },
        { pitch: null, duration: '4n' },
        { pitch: 'A1', duration: '4n' },

        // Bar 3-4: Descending bass
        { pitch: 'A2', duration: '2n' },
        { pitch: 'G#2', duration: '2n' },
        { pitch: 'G2', duration: '2n' },
        { pitch: 'F2', duration: '2n' },

        // Bar 5-6
        { pitch: 'D2', duration: '1n' },
        { pitch: 'Bb1', duration: '2n' },
        { pitch: 'C2', duration: '2n' },

        // Bar 7-8
        { pitch: 'D2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'D2', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'D2', duration: '2n' },
        { pitch: null, duration: '2n' },

        // Bar 9-10
        { pitch: 'F2', duration: '1n' },
        { pitch: 'E2', duration: '2n' },
        { pitch: 'D2', duration: '2n' },

        // Bar 11-12: Tritone bass
        { pitch: 'D2', duration: '2n' },
        { pitch: 'G#1', duration: '2n' },
        { pitch: 'D2', duration: '2n' },
        { pitch: 'G#1', duration: '4n' },
        { pitch: 'A1', duration: '4n' },

        // Bar 13-14
        { pitch: 'Bb1', duration: '1n' },
        { pitch: 'C2', duration: '2n' },
        { pitch: 'A1', duration: '2n' },

        // Bar 15-16
        { pitch: 'D2', duration: '2n' },
        { pitch: null, duration: '2n' },
        { pitch: 'D2', duration: '4n' },
        { pitch: null, duration: '2n' },
        { pitch: null, duration: '4n' },
      ]
    }
  ]
}
