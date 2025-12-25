import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy dependencies into separate chunks
          'dnd-kit': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    // Increase warning threshold since we've optimized what we can
    chunkSizeWarningLimit: 600,
  },
})
