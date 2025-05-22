import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase the warning limit to avoid unnecessary warnings
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manual chunking strategy for better performance
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'ui': ['@radix-ui/react-select', '@radix-ui/react-label', '@radix-ui/react-slot']
        }
      }
    }
  },
  // Optimize deps to speed up dev server
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts']
  }
})
