// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
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
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve("./src"),
      },
    },
  },
});
