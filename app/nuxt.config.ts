// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-07',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],

  // Ignore patterns for file watching
  ignore: [
    'results/accessibility-scan.json',
    'results/*.json',
    '**/accessibility-scan.json'
  ],

  nitro: {
    // Ignore patterns for server watching
    watchOptions: {
      ignored: [
        '**/results/**',
        '**/accessibility-scan.json'
      ]
    }
  }
})