import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // This forces Vite to use only one copy of React, fixing the Recharts crash
    dedupe: ['react', 'react-dom']
  }
})