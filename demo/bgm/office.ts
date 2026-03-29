import { BGMDefinition } from '../../src/types'

/**
 * Office/City Theme - Bright, purposeful morning-in-the-city feel
 * Key: G major, BPM: 125, 16 bars
 * Warm and inviting like Zelda town music — catchy, hummable, makes you want to keep going
 * Chord progression: G - C - Em - D | G - C - Am - D | (varied B section) | back to G
 */
export const office: BGMDefinition = {
  bpm: 125,
  loop: true,
  channels: [
    // Melody - Square wave
    {
      wave: 'square',
      duty: 0.5,
      volume: 0.5,
      notes: [
        // === A Section (Bars 1-8): Main theme ===

        // Bar 1 (G): Bright opening motif - the "hook"
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D5', duration: '8n' },

        // Bar 2 (C): Answering phrase, settling down
        { pitch: 'C5', duration: '4n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'C5', duration: '8n' },
        { pitch: 'G4', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 3 (Em): Gentle step up
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },

        // Bar 4 (D): Resolving with a bounce
        { pitch: 'D5', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 5 (G): Repeat hook with variation
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'G5', duration: '4n' },

        // Bar 6 (C): Higher energy answer
        { pitch: 'E5', duration: '8n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D5', duration: '4n' },

        // Bar 7 (Am): Winding down phrase
        { pitch: 'C5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'C5', duration: '8n' },
        { pitch: 'B4', duration: '4n' },
        { pitch: 'A4', duration: '4n' },

        // Bar 8 (D): Half cadence - breath before B section
        { pitch: 'D5', duration: '4n' },
        { pitch: null, duration: '4n' },
        { pitch: 'F#4', duration: '8n' },
        { pitch: 'A4', duration: '8n' },
        { pitch: 'D5', duration: '4n' },

        // === B Section (Bars 9-12): Contrasting, slightly dreamy ===

        // Bar 9 (Em): New melodic idea - stepwise and lyrical
        { pitch: 'G5', duration: '4n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'B4', duration: '4n' },

        // Bar 10 (C): Gentle descent
        { pitch: 'C5', duration: '4n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 11 (Am): Building back up
        { pitch: 'E5', duration: '8n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'G5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },

        // Bar 12 (D): Tension, leading back
        { pitch: 'D5', duration: '8n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'D5', duration: '4n' },

        // === A' Section (Bars 13-16): Return and resolution ===

        // Bar 13 (G): Hook returns
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D5', duration: '8n' },

        // Bar 14 (C): Familiar answer
        { pitch: 'C5', duration: '4n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'C5', duration: '8n' },
        { pitch: 'G4', duration: '4n' },
        { pitch: null, duration: '4n' },

        // Bar 15 (Am -> D): Building to final cadence
        { pitch: 'A4', duration: '8n' },
        { pitch: 'C5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },

        // Bar 16 (G): Final resolution - lands on G
        { pitch: 'G5', duration: '4n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'B4', duration: '8n' },
        { pitch: 'G4', duration: '8n' },
        { pitch: 'G4', duration: '4n' },
      ]
    },
    // Bass - Triangle wave (bouncy walking pattern)
    {
      wave: 'triangle',
      volume: 0.4,
      notes: [
        // === A Section (Bars 1-8) ===

        // Bar 1 (G): Root-fifth bounce
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: 'B2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 2 (C): Walking up
        { pitch: 'C3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'G3', duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 3 (Em): Minor color
        { pitch: 'E2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B2', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 4 (D): Dominant bounce
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'F#2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 5 (G): Variation on bar 1
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 6 (C): Walking bass
        { pitch: 'C3', duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: 'G3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 7 (Am): Walking down
        { pitch: 'A2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 8 (D): Leading back
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'F#2', duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: null, duration: '8n' },

        // === B Section (Bars 9-12) ===

        // Bar 9 (Em): Steady pulse
        { pitch: 'E2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: 'B2', duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 10 (C): Smooth walk
        { pitch: 'C3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'G3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 11 (Am): Building energy
        { pitch: 'A2', duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 12 (D): Dominant push
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F#3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'A2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // === A' Section (Bars 13-16) ===

        // Bar 13 (G): Return
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: 'B2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 14 (C): Walking up
        { pitch: 'C3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'G3', duration: '8n' },
        { pitch: 'E3', duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 15 (Am -> D): Cadential walk
        { pitch: 'A2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'C3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'F#3', duration: '8n' },
        { pitch: null, duration: '8n' },

        // Bar 16 (G): Final landing
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'B2', duration: '8n' },
        { pitch: 'D3', duration: '8n' },
        { pitch: 'G2', duration: '8n' },
        { pitch: null, duration: '8n' },
        { pitch: 'G2', duration: '4n' },
      ]
    }
  ]
}
