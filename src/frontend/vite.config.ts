import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [repoRoot],
    },
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
