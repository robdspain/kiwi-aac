import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'dnd-kit': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'capacitor': [
            '@capacitor/core',
            '@capacitor/haptics',
            '@capacitor/camera',
            '@capacitor/device',
            '@capacitor/share',
            '@capacitor/filesystem',
            '@capacitor-community/in-app-review'
          ],
          'revenuecat': ['@revenuecat/purchases-capacitor', '@revenuecat/purchases-capacitor-ui'],
          'ai-models': ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd'],
          'ui-utils': ['framer-motion', 'qrcode.react'],
        }
      }
    },
    // Increase warning threshold since we've optimized what we can
    chunkSizeWarningLimit: 600,
    sourcemap: true,
  },
})
