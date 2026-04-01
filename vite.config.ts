import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    // Demo page build for Vercel
    return {}
  }
  if (mode === 'cdn') {
    return {
      build: {
        lib: {
          entry: 'src/index.ts',
          name: 'EightBit',
          fileName: () => 'sdk.js',
          formats: ['iife']
        },
        outDir: 'public',
        emptyOutDir: false
      }
    }
  }
  // Default: library build (npm)
  return {
    build: {
      copyPublicDir: false,
      lib: {
        entry: 'src/index.ts',
        name: 'EightBitSound',
        fileName: '8bit-sound-engine',
        formats: ['es', 'cjs']
      }
    }
  }
})
