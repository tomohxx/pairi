import { defineConfig } from "vite";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { API_PROXY_TARGET: apiProxyTarget } = loadEnv(mode, process.cwd(), "");

  return {
    base: "/pairi/",
    plugins: [react(), wasm(), svgr(), tailwindcss()],
    server: apiProxyTarget
      ? {
          proxy: {
            "/api": {
              target: apiProxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          },
        }
      : undefined,
  };
});
