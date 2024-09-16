import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost', // URL da sua API Laravel
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
