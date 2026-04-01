/**
 * Custom periodic waveforms for instrument simulation.
 * Uses PeriodicWave with harmonic coefficients to create distinct timbres.
 */

const waveCache = new Map<string, PeriodicWave>()

// Harmonic profiles: [real coefficients] (imaginary all zero)
// Index 0 = DC offset (always 0), index 1 = fundamental, index 2 = 2nd harmonic, etc.
const WAVE_HARMONICS: Record<string, number[]> = {
  // Piano: strong fundamental, rapid harmonic decay, bright attack
  piano: [0, 1, 0.6, 0.35, 0.2, 0.12, 0.08, 0.04, 0.02],

  // Strings: rich, even harmonics, warm and sustained
  strings: [0, 1, 0.8, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08, 0.05],

  // Organ: drawbar-style, specific harmonics emphasized (1, 2, 3, 4, 6, 8)
  organ: [0, 1, 0.7, 0.5, 0.4, 0, 0.3, 0, 0.2, 0, 0, 0, 0.1],

  // Bell: inharmonic feel — strong fundamental + sparse upper partials
  bell: [0, 1, 0.1, 0.5, 0.05, 0.3, 0.02, 0.2, 0.01, 0.15, 0.01, 0.1],

  // Choir: filtered vowel-like — odd harmonics dominant (similar to clarinet)
  choir: [0, 1, 0.1, 0.7, 0.05, 0.4, 0.02, 0.25, 0.01, 0.15, 0.01, 0.08],
}

const CUSTOM_WAVE_TYPES = new Set(Object.keys(WAVE_HARMONICS))

export function isCustomWave(wave: string): boolean {
  return CUSTOM_WAVE_TYPES.has(wave)
}

export function getCustomWave(ctx: AudioContext, wave: string): PeriodicWave {
  const cacheKey = `${wave}-${ctx.sampleRate}`
  if (waveCache.has(cacheKey)) return waveCache.get(cacheKey)!

  const harmonics = WAVE_HARMONICS[wave]
  if (!harmonics) throw new Error(`Unknown custom wave: ${wave}`)

  const real = new Float32Array(harmonics.length)
  const imag = new Float32Array(harmonics.length)
  for (let i = 0; i < harmonics.length; i++) {
    imag[i] = harmonics[i] // sine components for warmer sound
  }

  const periodicWave = ctx.createPeriodicWave(real, imag, { disableNormalization: false })
  waveCache.set(cacheKey, periodicWave)
  return periodicWave
}
