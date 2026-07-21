import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'; // <-- 1. Import plugin React

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'], // <-- 2. Ubah app.js jadi app.jsx
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
        react(), // <-- 3. Masukkan plugin React ke dalam array plugins
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});