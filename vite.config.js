import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            input: {
                main: 'index.html',
                gallery: 'gallery.html',
                sculpture: 'sculpture.html',
                contact: 'contact.html',
                login: 'login.html'
            },
            output: {
                manualChunks: {
                    playcanvas: ['playcanvas']
                }
            }
        }
    },
    server: {
        host: true, // Expose to network
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true
            }
        }
    },
    assetsInclude: ['**/*.sog']
});
