import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 4000, // Replace 3006 with your desired port number
  },
  envPrefix: ['VITE_', 'REACT_APP_']
})
