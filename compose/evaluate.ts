export interface ValidationResult {
  valid: boolean
  errors: string[]
}

const VALID_WAVES = ['square', 'triangle', 'sawtooth', 'noise']
const VALID_DURATIONS = ['1n', '2n', '4n', '8n', '16n', '32n']
const PITCH_REGEX = /^[A-G][b#]?[1-8]$/

export function validateBGMDefinition(input: unknown): ValidationResult {
  const errors: string[] = []

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Input must be an object'] }
  }

  const def = input as Record<string, unknown>

  // BPM
  if (typeof def.bpm !== 'number' || def.bpm < 40 || def.bpm > 240) {
    errors.push(`bpm must be a number between 40 and 240, got ${def.bpm}`)
  }

  // Channels
  if (!Array.isArray(def.channels) || def.channels.length === 0) {
    return { valid: false, errors: [...errors, 'channels must be a non-empty array'] }
  }

  if (def.channels.length > 6) {
    errors.push(`channels must have at most 6 entries, got ${def.channels.length}`)
  }

  for (let i = 0; i < def.channels.length; i++) {
    const ch = def.channels[i] as Record<string, unknown>
    const prefix = `channels[${i}]`

    if (!VALID_WAVES.includes(ch.wave as string)) {
      errors.push(`${prefix}.wave must be one of ${VALID_WAVES.join(', ')}, got '${ch.wave}'`)
    }

    if (ch.volume !== undefined) {
      const v = ch.volume as number
      if (typeof v !== 'number' || v < 0 || v > 1) {
        errors.push(`${prefix}.volume must be 0-1, got ${v}`)
      }
    }

    if (ch.pan !== undefined) {
      const p = ch.pan as number
      if (typeof p !== 'number' || p < -1 || p > 1) {
        errors.push(`${prefix}.pan must be -1 to 1, got ${p}`)
      }
    }

    if (!Array.isArray(ch.notes) || ch.notes.length === 0) {
      errors.push(`${prefix}.notes must be a non-empty array`)
      continue
    }

    for (let j = 0; j < ch.notes.length; j++) {
      const note = ch.notes[j] as Record<string, unknown>
      const notePrefix = `${prefix}.notes[${j}]`

      if (note.pitch !== null) {
        if (typeof note.pitch !== 'string' || !PITCH_REGEX.test(note.pitch)) {
          errors.push(`${notePrefix}.pitch must be null or match pattern like 'C4', 'F#5', 'Bb3', got '${note.pitch}'`)
        }
      }

      if (!VALID_DURATIONS.includes(note.duration as string)) {
        errors.push(`${notePrefix}.duration must be one of ${VALID_DURATIONS.join(', ')}, got '${note.duration}'`)
      }
    }
  }

  // Variations
  if (def.variations !== undefined) {
    if (!Array.isArray(def.variations)) {
      errors.push('variations must be an array')
    } else {
      for (let i = 0; i < def.variations.length; i++) {
        const v = def.variations[i] as Record<string, unknown>
        const prefix = `variations[${i}]`

        if (typeof v.name !== 'string' || v.name.length === 0) {
          errors.push(`${prefix}.name must be a non-empty string`)
        }

        if (!Array.isArray(v.layers)) {
          errors.push(`${prefix}.layers must be an array`)
        } else if (v.layers.length !== def.channels.length) {
          errors.push(`${prefix}.layers length (${v.layers.length}) must match channels length (${def.channels.length})`)
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}
