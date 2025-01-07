import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

const isDocker = process.env.DOCKER_ENV === 'true';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: isDocker ? 'http://backend:5000' : 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        ws: true
      },
    },
  },
});