import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
var repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        fs: {
            allow: [repoRoot],
        },
        proxy: {
            '/api': 'http://localhost:8080',
        },
    },
});
