import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import CaseSensitivePaths from "vite-plugin-case-sensitive-paths";

export default defineConfig({
  plugins: [
    react(),
    CaseSensitivePaths(), // ✅ handles Windows → Linux mismatch
  ],
});