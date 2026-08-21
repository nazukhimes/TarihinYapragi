import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,          // ağdaki diğer cihazlardan erişim
    port: 3000,          // tercih edilen port
    strictPort: false,   // meşgulse bir sonrakine geç
  },
});
