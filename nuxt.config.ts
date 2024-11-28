// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt'],
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  pwa: {
    manifest: {
      name: 'Capitalis AI App',
      short_name: 'Capitalis',
      description: 'A powerful AI-driven application',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'icons/icon-64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'icons/icon-144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    }
  }
})
