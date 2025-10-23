// electron.config.ts — configuración para compilar el proceso principal y el preload

import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import path from "path";

export default defineConfig({
  plugins: [
    electron([
      {
        // Proceso principal de Electron
        entry: "electron/main.ts",
      },
      {
        // Script de precarga (preload)
        entry: "electron/preload.ts",
        vite: {
          build: {
            outDir: "dist-electron", // Asegura que el preload se compile aquí
            lib: {
              entry: "electron/preload.ts",
              formats: ["cjs"], // Compila como CommonJS para evitar errores de import
            },
            rollupOptions: {
              external: ["electron"], // No incluir Electron en el bundle
            },
          },
        },
      },
    ]),
  ],
  build: {
    outDir: "dist-electron",
    emptyOutDir: true,
    rollupOptions: {
      external: ["electron"],
    },
  },
});
