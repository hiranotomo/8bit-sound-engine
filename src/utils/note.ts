const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

const FLAT_TO_SHARP: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B'
}

export function noteToFrequency(note: string | null): number {
  if (note === null) return 0
  const match = note.match(/^([A-G][#b]?)(\d)$/)
  if (!match) throw new Error(`Invalid note: ${note}`)
  let [, name, octaveStr] = match
  const octave = parseInt(octaveStr)
  if (name in FLAT_TO_SHARP) name = FLAT_TO_SHARP[name]
  const semitone = NOTE_NAMES.indexOf(name)
  if (semitone === -1) throw new Error(`Invalid note name: ${name}`)
  const midiNote = (octave + 1) * 12 + semitone
  return 440 * Math.pow(2, (midiNote - 69) / 12)
}
