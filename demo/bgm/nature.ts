import { BGMDefinition } from '../../src/types'

/**
 * Nature/Adventure Theme - Hopeful, wide-open exploration theme
 * Key: D major, BPM: 115, 16 bars
 * Evokes setting out on a new journey through forests and mountains
 * Square wave melody + Triangle wave walking bass (no noise channel)
 */
export const nature: BGMDefinition = {
  bpm: 115,
  loop: true,
  channels: [
    // Melody - Square wave
    {
      wave: 'square',
      duty: 0.5,
      volume: 0.5,
      notes: [
        // === Section A: Main Theme (Bars 1-4) ===

        // Bar 1: Opening call - leap up a 5th, sets the adventure tone
        { pitch: 'D5', duration: '4n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },

        // Bar 2: Answering phrase - gentle descent
        { pitch: 'B5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },

        // Bar 3: Rising again with wider intervals
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'B5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'D6', duration: '4n' },

        // Bar 4: Resolution with a breath
        { pitch: 'C#6', duration: '8n' },
        { pitch: 'B5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: null, duration: '4n' },

        // === Section A': Main Theme Variation (Bars 5-8) ===

        // Bar 5: Repeat call with decoration
        { pitch: 'D5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'G5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },

        // Bar 6: Higher energy answer
        { pitch: 'B5', duration: '4n' },
        { pitch: 'D6', duration: '4n' },
        { pitch: 'C#6', duration: '8n' },
        { pitch: 'B5', duration: '8n' },
        { pitch: 'A5', duration: '4n' },

        // Bar 7: Climactic phrase - reaching the summit
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'B5', duration: '4n' },
        { pitch: 'D6', duration: '4n' },
        { pitch: 'E6', duration: '4n' },

        // Bar 8: Descending release
        { pitch: 'D6', duration: '8n' },
        { pitch: 'C#6', duration: '8n' },
        { pitch: 'B5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: null, duration: '4n' },

        // === Section B: Gentle Valley (Bars 9-12) ===

        // Bar 9: Softer, flowing - like crossing a meadow
        { pitch: 'G5', duration: '4n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D5', duration: '4n' },
        { pitch: 'A4', duration: '4n' },

        // Bar 10: Winding upward again
        { pitch: 'B4', duration: '8n' },
        { pitch: 'D5', duration: '8n' },
        { pitch: 'E5', duration: '4n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'A5', duration: '4n' },

        // Bar 11: Moment of wonder - wide leap
        { pitch: 'G5', duration: '4n' },
        { pitch: 'B5', duration: '4n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'E5', duration: '4n' },

        // Bar 12: Building anticipation
        { pitch: 'D5', duration: '8n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'G5', duration: '4n' },
        { pitch: 'F#5', duration: '4n' },

        // === Section A'': Return - Triumphant (Bars 13-16) ===

        // Bar 13: Main theme returns with conviction
        { pitch: 'D5', duration: '4n' },
        { pitch: 'A5', duration: '4n' },
        { pitch: 'B5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'D6', duration: '4n' },

        // Bar 14: Soaring continuation
        { pitch: 'C#6', duration: '4n' },
        { pitch: 'B5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'E5', duration: '4n' },

        // Bar 15: Final ascent
        { pitch: 'F#5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'B5', duration: '4n' },
        { pitch: 'D6', duration: '4n' },
        { pitch: 'A5', duration: '4n' },

        // Bar 16: Resolve home, ready to loop
        { pitch: 'B5', duration: '8n' },
        { pitch: 'A5', duration: '8n' },
        { pitch: 'F#5', duration: '4n' },
        { pitch: 'D5', duration: '2n' },
      ]
    },
    // Bass - Triangle wave (walking/flowing feel)
    {
      wave: 'triangle',
      volume: 0.4,
      notes: [
        // === Section A (Bars 1-4) ===

        // Bar 1: D major root - steady foundation
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A3', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'F#3', duration: '4n' },

        // Bar 2: Walking down through G
        { pitch: 'G3', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'B2', duration: '4n' },
        { pitch: 'A2', duration: '4n' },

        // Bar 3: D to G motion
        { pitch: 'D3', duration: '4n' },
        { pitch: 'F#3', duration: '4n' },
        { pitch: 'G3', duration: '4n' },
        { pitch: 'A3', duration: '4n' },

        // Bar 4: A to D resolution
        { pitch: 'A2', duration: '4n' },
        { pitch: 'E3', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A2', duration: '4n' },

        // === Section A' (Bars 5-8) ===

        // Bar 5: D pedal with movement
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A3', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'F#3', duration: '4n' },

        // Bar 6: G major feel
        { pitch: 'G2', duration: '4n' },
        { pitch: 'B2', duration: '4n' },
        { pitch: 'A2', duration: '4n' },
        { pitch: 'E3', duration: '4n' },

        // Bar 7: Building - D to B minor
        { pitch: 'D3', duration: '4n' },
        { pitch: 'F#3', duration: '4n' },
        { pitch: 'B2', duration: '4n' },
        { pitch: 'G3', duration: '4n' },

        // Bar 8: A dominant - tension and release
        { pitch: 'A2', duration: '4n' },
        { pitch: 'C#3', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A2', duration: '4n' },

        // === Section B (Bars 9-12) ===

        // Bar 9: G major - brighter bass
        { pitch: 'G2', duration: '4n' },
        { pitch: 'B2', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A2', duration: '4n' },

        // Bar 10: Walking up through E minor
        { pitch: 'E3', duration: '4n' },
        { pitch: 'G3', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A3', duration: '4n' },

        // Bar 11: G to B minor
        { pitch: 'G2', duration: '4n' },
        { pitch: 'B2', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A2', duration: '4n' },

        // Bar 12: Building back to A dominant
        { pitch: 'B2', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A2', duration: '4n' },
        { pitch: 'C#3', duration: '4n' },

        // === Section A'' (Bars 13-16) ===

        // Bar 13: Return to D - triumphant
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A3', duration: '4n' },
        { pitch: 'G3', duration: '4n' },
        { pitch: 'F#3', duration: '4n' },

        // Bar 14: A major to D
        { pitch: 'A2', duration: '4n' },
        { pitch: 'E3', duration: '4n' },
        { pitch: 'D3', duration: '4n' },
        { pitch: 'A2', duration: '4n' },

        // Bar 15: Walking up for final approach
        { pitch: 'D3', duration: '4n' },
        { pitch: 'F#3', duration: '4n' },
        { pitch: 'G3', duration: '4n' },
        { pitch: 'A3', duration: '4n' },

        // Bar 16: Final resolution to D
        { pitch: 'A2', duration: '4n' },
        { pitch: 'E3', duration: '4n' },
        { pitch: 'D3', duration: '2n' },
      ]
    }
  ]
}
