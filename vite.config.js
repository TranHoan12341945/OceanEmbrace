import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://poserdungeon.myddns.me:5000', // URL API server của bạn
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Xóa tiền tố /api nếu cần
      }
    }
  }
});
