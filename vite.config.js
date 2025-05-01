// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // hoặc port nào bạn muốn
  },
  define: {
    global: "globalThis", // giả lập `global` dùng `globalThis`
  },
});
