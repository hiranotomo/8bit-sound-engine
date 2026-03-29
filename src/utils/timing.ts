export function durationToSeconds(duration: string, bpm: number): number {
  const beatDuration = 60 / bpm
  const match = duration.match(/^(\d+)n$/)
  if (!match) throw new Error(`Invalid duration: ${duration}`)
  const divisor = parseInt(match[1])
  return (4 / divisor) * beatDuration
}
