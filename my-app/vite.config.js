import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/, // Apply JSX parsing to .js files in src/
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
