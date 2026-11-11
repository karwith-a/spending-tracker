import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['recharts'],
    esbuildOptions: {
      target: 'esnext' // This helps resolve ESM issues during build
    }
  },
  build: {
    rollupOptions: {
      // This helps Rollup bundle correctly
      output: {
        manualChunks: undefined
      }
    }
  }
})