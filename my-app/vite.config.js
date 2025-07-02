import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  root: '.',  // Explicitly set root directory
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
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  define: {
    'process.env': process.env,
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});