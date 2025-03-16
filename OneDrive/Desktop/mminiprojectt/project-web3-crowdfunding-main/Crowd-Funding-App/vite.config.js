console.log('Vite configuration loaded');import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    historyApiFallback: true
  }
});
