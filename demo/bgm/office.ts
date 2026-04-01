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
  variations: [
    { name: 'FULL',     layers: [true,  true,  true,  true]  },
    { name: 'HUSTLE',   layers: [false, true,  false, true]  },
    { name: 'FOCUS',    layers: [true,  false, true,  false] },
    { name: 'COFFEE',   layers: [true,  true,  false, false] },
    { name: 'ELEVATOR', layers: [false, false, true,  true]  },
    { name: 'SOLO',     layers: [true,  false, false, false] },
  ],
  channels: [
    // Melody — triangle (warm, recorder-like) — slightly right
    {
      wave: 'piano',
      label: 'melody',
      volume: 0.35,
      pan: 0.25,
      attack: 0.005,
      release: 0.08,
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
    // Bass — triangle WALKING bass (8th notes — busy, DQ city feel) — slightly left
    {
      wave: 'triangle',
      label: 'bass',
      volume: 0.3,
      pan: -0.25,
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
    },
    // Harmony — sawtooth (soft pad-like chords) — slightly left
    {
      wave: 'strings',
      label: 'harmony',
      volume: 0.12,
      pan: -0.3,
      attack: 0.1,
      release: 0.2,
      detune: 8,
      notes: [
        // Bar 1: Bb (I) — 3rd
        { pitch: 'D4', duration: '1n' },
        // Bar 2: Eb (IV) — 3rd
        { pitch: 'G4', duration: '1n' },
        // Bar 3: Bb (I) — 5th
        { pitch: 'F4', duration: '1n' },
        // Bar 4: F (V) — 3rd + 5th
        { pitch: 'A4', duration: '2n' },
        { pitch: 'C5', duration: '2n' },
        // Bar 5: Bb (I) — 3rd
        { pitch: 'D4', duration: '1n' },
        // Bar 6: Eb/G — 3rd then Eb root
        { pitch: 'G4', duration: '2n' },
        { pitch: 'Eb4', duration: '2n' },
        // Bar 7: Cm (ii) — 3rd then F (V) — 3rd
        { pitch: 'Eb4', duration: '2n' },
        { pitch: 'A4', duration: '2n' },
        // Bar 8: Bb (I) — resolve + rest
        { pitch: 'F4', duration: '2n' },
        { pitch: null, duration: '2n' },
      ]
    },
    // Rhythm — square (percussive staccato) — center-right
    {
      wave: 'square',
      label: 'rhythm',
      volume: 0.15,
      pan: 0.1,
      notes: [
        // Bar 1: note-rest-note-note-rest-note-note-rest
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        // Bar 2
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        // Bar 3
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        // Bar 4
        { pitch: 'F4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F4', duration: '8n' },
        { pitch: 'F4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F4', duration: '8n' },
        { pitch: 'F4', duration: '8n' },
        { pitch: null, duration: '8n' },
        // Bar 5
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        // Bar 6
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        // Bar 7
        { pitch: 'F4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F4', duration: '8n' },
        { pitch: 'F4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F4', duration: '8n' },
        { pitch: 'F4', duration: '8n' },
        { pitch: null, duration: '8n' },
        // Bar 8: wind down
        { pitch: 'Bb4', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: null, duration: '4n' },
        { pitch: null, duration: '2n' },
      ]
    }
  ]
}
