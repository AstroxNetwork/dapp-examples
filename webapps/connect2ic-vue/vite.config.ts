import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import path from "path"

const isDev = process.env["DFX_NETWORK"] !== "ic"

// See guide on how to configure Vite at:
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Here we tell Vite the "fake" modules that we want to define
      "vue": path.resolve("./node_modules/vue"),
    },
  },
  server: {
    fs: {
      allow: ["."],
    },
    proxy: {
      // This proxies all http requests made to /api to our running dfx instance
      "/api": {
        target: `http://0.0.0.0:${8000}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  define: {
    // Here we can define global constants
    // This is required for now because the code generated by dfx relies on process.env being set
    "process.env.NODE_ENV": JSON.stringify(
        isDev ? "development" : "production",
    ),
  },
})