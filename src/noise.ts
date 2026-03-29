// src/noise.ts
export function createNoiseNode(ctx: AudioContext, duration: number, startTime: number): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.start(startTime)
  source.stop(startTime + duration)
  return source
}
