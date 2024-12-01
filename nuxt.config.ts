// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: [
      'vuetify',
      '@teamhanko/hanko-frontend-sdk',
      '@teamhanko/hanko-elements'
    ],
  },
  modules: ['@vite-pwa/nuxt'],
  plugins: [
    { src: '~/plugins/hanko.client', mode: 'client' }
  ],
  devServer: {
    port: 4000,
    host: '0.0.0.0',
    https: true
  },
  nitro: {
    port: 4000,
    host: '0.0.0.0',
    logLevel: 'debug',
    debug: true,
    https: true
  },
  pwa: {
    manifest: {
      name: 'Capitalis AI',
      short_name: 'Capitalis AI',
      description: 'Capitalis AI Application',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    }
  },
  runtimeConfig: {
    public: {
      hankoApi: process.env.NUXT_PUBLIC_HANKO_API_URL || 'https://46f53e73-2fea-4501-a0a4-5b285614b775.hanko.io',
    }
  },
  app: {
    head: {
      title: 'Capitalis AI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  typescript: {
    strict: true
  }
})
