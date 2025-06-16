// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/tailwind.css"],
  pages: false,

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      waveApiUrl: "https://wave.webaim.org/api/request",
      pa11yApiUrl:
        process.env.PA11Y_API_URL || "http://localhost:3000/api/pa11y",
    },
  },

  app: {
    head: {
      title: "Accessibility Dashboard",
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Unified accessibility testing dashboard",
        },
      ],
    },
  },

  // Explicitly configure Vite's file watcher
  vite: {
    server: {
      watch: {
        // Ignore node_modules and .output when watching files
        // Using a regex pattern to match paths containing these directory names
        ignored: [/\/(node_modules)\//, /\/\.nuxt\//, /\/\.output\//],
        // Optional: You might need 'usePolling: true' in specific environments (like Docker)
        // if the default watcher doesn't work, but try without it first.
        // usePolling: true,
      },
    },
  },

  compatibilityDate: "2025-04-17",
});