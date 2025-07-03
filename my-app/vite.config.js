import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Changed from './' to absolute path for Vercel
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://chatgpt-clone-br89.onrender.com'
          : 'http://localhost:8080',
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production', // Sourcemaps in dev only
    manifest: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js', // Added dash for better cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios'] // Add other large dependencies here
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, './') // Root alias
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'] // Pre-bundle these for faster dev
  }
});