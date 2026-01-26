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
            output: {
                manualChunks: {
                    playcanvas: ['playcanvas']
                }
            }
        }
    },
    server: {
        port: 3000,
        open: true
    },
    assetsInclude: ['**/*.sog']
});
