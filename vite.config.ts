import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // the public site uses 5173
    proxy: {
      // The browser calls /api/... on this dev server, and Vite forwards it to Spring Boot.
      // To the browser it's the same origin, so no CORS setup is needed. In production,
      // Nginx does the same job.
      '/api': 'http://localhost:8081',
    },
  },
})
