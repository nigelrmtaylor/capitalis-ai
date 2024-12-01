// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/hanko'
  ],
  runtimeConfig: {
    public: {
      hankoApi: process.env.NUXT_PUBLIC_HANKO_API_URL,
    }
  },
  hanko: {
    apiURL: process.env.NUXT_PUBLIC_HANKO_API_URL,
  },

  devServer: {
  },
  nitro: {
    logLevel: 'debug',
    debug: true,
    routeRules: {
      '/**': { cors: true }
    }
  },
  app: {
    head: {
      title: 'Capitalis AI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },
    baseURL: '/',
  },
  vite: {
    server: {
      hmr: {
        port: 4000,
        host: '0.0.0.0'
      }
    }
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
      globPatterns: ['**/*.{js,css,html}'],
      globDirectory: 'public',
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    strategies: 'generateSW',
    injectRegister: 'auto'
  },
  typescript: {
    strict: true
  }
})
