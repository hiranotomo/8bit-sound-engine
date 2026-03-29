/**
 * Simple algorithmic reverb using a generated impulse response.
 * No external files needed — pure Web Audio API.
 */
export function createReverb(ctx: AudioContext, duration = 1.5, decay = 2.0): ConvolverNode {
  const sampleRate = ctx.sampleRate
  const length = sampleRate * duration
  const impulse = ctx.createBuffer(2, length, sampleRate)

  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }

  const convolver = ctx.createConvolver()
  convolver.buffer = impulse
  return convolver
}
