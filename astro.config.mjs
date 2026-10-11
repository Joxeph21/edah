// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { resolve } from "node:path";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://edahartist.com",

  image: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },

  fonts: [
    {
      name: "Architects Daughter",
      cssVariable: "--font-architects-daughter",
      provider: fontProviders.google(),
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
    },
    {
      name: "Biryani",
      cssVariable: "--font-biryani",
      provider: fontProviders.google(),
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
    },
  ],

  vite: {
    server: {
      host: true,
      allowedHosts: ["https://bobcat-washboard-unmixed.ngrok-free.dev"],
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve("./src"),
      },
    },
  },

  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),

  integrations: [sitemap()],
});