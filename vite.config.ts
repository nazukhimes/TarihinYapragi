import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // kendi manifest.webmanifest dosyamızı kullanıyoruz
      includeAssets: ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "og-image.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.wikimedia\.org\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "wikimedia-otd",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "wikimedia-gorsel",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,          // ağdaki diğer cihazlardan erişim
    port: 3000,          // tercih edilen port
    strictPort: false,   // meşgulse bir sonrakine geç
  },
});
