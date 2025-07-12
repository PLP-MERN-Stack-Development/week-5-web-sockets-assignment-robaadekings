import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  /* ←–––––––––––––––––––––– add this block ––––––––––––––––––––––→ */
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your Express port
        changeOrigin: true,
      },
    },
  },
});