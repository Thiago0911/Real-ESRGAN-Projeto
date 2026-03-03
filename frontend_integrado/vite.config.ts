import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: mode === "development"
    ? {
        proxy: {
          "/api": "http://localhost:3001",
        },
        host: "::",
        port: 8080,
        hmr: {
          overlay: false,
        },
      }
    : undefined,

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));