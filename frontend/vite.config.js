import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/brevo-api': {
        target: 'https://api.brevo.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/brevo-api/, '/v3'),
      },
    },
  },
});
