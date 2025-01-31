import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    base: '/',  // Set the correct base path
  build: {
    outDir: 'dist'
  },
    server: {
    historyApiFallback: true // Ensures correct handling of client-side routing
  }
  }
})
