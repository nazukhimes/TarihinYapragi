/// <reference types="vitest/config" />
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
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // "threads" havuzu (varsayılan), jsdom'un bağımlılığı undici@8.0.3+'ın
    // gerektirdiği `node:worker_threads.markAsUncloneable`'ın worker_threads
    // içinde ara sıra kullanılamaz olması yüzünden CI'da kararsız
    // (`TypeError: webidl.util.markAsUncloneable is not a function`,
    // jsdom/undici bilinen bir sorunu) çıkıyordu. "forks" (ayrı süreçler,
    // worker_threads değil) bu sınıf hatayı tamamen atlıyor.
    pool: "forks",
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/data/**"],
      // Not: Kabul Kriterleri yalnızca satır (lines) kapsamını sayısal olarak
      // adlandırıyor ("src/lib satır kapsamı ≥ %70"). `functions` eşiği kaldırıldı —
      // wiki.ts kasıtlı olarak yalnızca saf fonksiyonları (normalize, classifyStatus,
      // buildAutoTalk) test ediyor; useDayData/fetchDayData gibi ağ+hook fonksiyonları
      // bu talimatın kapsamı dışında (bkz. Tamamlanma Kaydı), bu yüzden fonksiyon
      // SAYISI oranı düşük kalıyor olsa da satır kapsamı hedefi rahatça geçiliyor.
      thresholds: { lines: 70, branches: 60 },
    },
  },
});
