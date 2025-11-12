// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Ya no necesitas importar svgr

export default defineConfig({
  plugins: [
    react(),
    // Ya no necesitas svgr() aquí
  ],
})