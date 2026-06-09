import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Jalur konfigurasi bersih untuk Tailwind v3 (Tanpa import @tailwindcss/vite)
export default defineConfig({
  plugins: [react()],
});