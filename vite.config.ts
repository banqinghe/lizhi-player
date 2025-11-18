import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import generouted from '@generouted/react-router/plugin';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { qrcode } from 'vite-plugin-qrcode';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        generouted(),
        tailwindcss(),
        svgr(),
        tsconfigPaths(),
        qrcode(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['lizhi.png', 'lizhi-192.png', 'lizhi-512.png'],
            manifest: {
                name: 'Li Zhi Player',
                short_name: 'Li Zhi',
                start_url: '/',
                display: 'standalone',
                background_color: '#121212',
                theme_color: '#121212',
                description: 'Mobile web music player for Li Zhi songs.',
                icons: [
                    {
                        src: '/lizhi-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/lizhi-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                navigateFallback: '/index.html',
                runtimeCaching: [
                    {
                        // artwork assets rarely changes, so prefer cached copies.
                        urlPattern: ({ request }) => request.destination === 'image',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images',
                            expiration: {
                                maxEntries: 300,
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        // Keep JS/CSS fresh with stale-while-revalidate strategy.
                        urlPattern: ({ request }) =>
                            request.destination === 'script' || request.destination === 'style',
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'static-resources',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
            devOptions: {
                enabled: false,
            },
        }),
    ],
});
