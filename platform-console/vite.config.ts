import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

// UI 元件庫（@ark-tailkit/ui）現為獨立私有 package，由 pnpm 從 Forgejo 安裝
// （發布前以 file:../ark-tailkit-ui 橋接），不再 vendored 於本倉。
export default defineConfig({
  plugins: [tailwindcss(), solid()],
  resolve: {
    // console 自家程式碼一律相對路徑匯入；元件庫經由 @ark-tailkit/ui 從 node_modules 解析。
    alias: {},
  },
  server: {
    port: 5173,
    strictPort: true,
    // dev 時 console 與 API 不同 origin：只代理平台路徑（登入端點 ＋ RPC）。
    // 租戶 API（/api/v1）不代理 —— console 只走 platform/v1。
    proxy: {
      "/platform": { target: "http://localhost:3080", changeOrigin: true },
    },
    // 元件庫在 ../packages/ui（Vite root 之外），明示允許掃描。
    fs: { allow: [".."] },
  },
  build: { outDir: "dist" },
  // 測試設定與 alias 同源：另開 vitest.config.ts 會讓 alias 出現第二份定義而漂移。
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
