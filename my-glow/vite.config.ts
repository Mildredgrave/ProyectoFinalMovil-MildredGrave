import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons.svg", "pwa-icon.png"],
      manifest: {
        name: "Skincare Coreano",
        short_name: "MyGlow",
        description: "Tu guía personalizada de skincare coreano",
        theme_color: "#C0C0C0",
        background_color: "#C0C0C0",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-icon.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-icon.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"]
      }
    })
  ],
});