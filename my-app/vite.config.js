
//1-mothod  for deploy on vercel  
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Local backend during development
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/gemini': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
});

// 2 method for deploy on vercel
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': 'http://localhost:8080'
//     }
//   }
// });



// 3 method for deploy on vercel
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist' // Vercel will serve from this folder
//   },
//   // This proxy is useful for local development. In production,
//   // update your API URLs (via environment variables) so they point
//   // to your deployed backend.
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8080', // Change this as needed for local testing
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

