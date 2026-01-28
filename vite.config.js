import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'dnd-kit': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'vendor': ['react', 'react-dom'],
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
          'dicebear': ['@dicebear/core', '@dicebear/avataaars'],
          'ui-utils': ['framer-motion', 'qrcode.react'],
        }
      }
    },
    // Increase warning threshold since we've optimized what we can
    chunkSizeWarningLimit: 600,
    sourcemap: true,
  },
})
