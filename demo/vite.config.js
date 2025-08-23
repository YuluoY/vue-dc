import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'lodash-es': ['lodash-es']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['lodash-es']
  },
  base: process.env.NODE_ENV === 'production' ? '/vue-dc/' : '/'
})
