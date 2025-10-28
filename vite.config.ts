import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/luna/",
  server: {
    port: 3001,
    open: false,
  },
  build: {
    outDir: "build",
    sourcemap: false,
  },
});
