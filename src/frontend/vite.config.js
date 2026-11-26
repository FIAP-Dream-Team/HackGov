import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
var repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// Proteção contra clickjacking: nenhuma página do Minha Vez abre dentro de um
// iframe. Vale no `npm run dev` e no `npm run preview` (o build de produção).
// Ao publicar em outro servidor, ele precisa mandar os mesmos dois cabeçalhos;
// o script em index.html é a última barreira quando o servidor não manda.
var antiIframe = {
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "frame-ancestors 'none'",
};
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        headers: antiIframe,
        fs: {
            allow: [repoRoot],
        },
        proxy: {
            '/api': 'http://localhost:8080',
        },
    },
    preview: {
        headers: antiIframe,
        proxy: {
            '/api': 'http://localhost:8080',
        },
    },
});
