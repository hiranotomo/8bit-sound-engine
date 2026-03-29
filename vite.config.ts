import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'EightBitSound',
      fileName: '8bit-sound-engine'
    }
  }
})
