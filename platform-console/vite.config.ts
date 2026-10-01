import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

// UI 元件庫（vendored @salesorder/ui，位於 platform 倉內）：console 只共用元件庫，
// 不共用產品 SPA 的路由與路由守衛（那兩者由 console 自己的 router.tsx / guard.ts 取代；
// S11：租戶 SPA 不得出現平台能力）。
const UI_DIR = path.resolve(import.meta.dirname, "../packages/ui/src/ui");

export default defineConfig({
  plugins: [tailwindcss(), solid()],
  resolve: {
    // console 自家程式碼一律相對路徑匯入（`./lib/api`）；`@ui` alias 只為讓元件庫入口原樣解析。
    alias: {
      "@ui/": `${UI_DIR}/`,
      "@ui": path.join(UI_DIR, "index.ts"),
    },
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
