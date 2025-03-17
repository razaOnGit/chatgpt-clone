import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://chatgpt-clone-br89.onrender.com' // Your Render backend URL
          : 'http://localhost:8080',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // Remove external, or only externalize true runtime dependencies (e.g., CDN libs)
      external: [] // Or leave it out entirely
    }
  },
  define: {
    'process.env': process.env
  }
});