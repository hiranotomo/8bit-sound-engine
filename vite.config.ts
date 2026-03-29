import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    // Demo page build for Vercel
    return {}
  }
  // Library build
  return {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'EightBitSound',
        fileName: '8bit-sound-engine'
      }
    }
  }
})
