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
    '@nigelrmtaylor/hanko-nuxt-module',
    '@nuxtjs/apollo',
    '@nuxtjs/onesignal'
  ],
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_URL || 'http://graphql-server.capitalis/graphql',
        wsEndpoint: process.env.GRAPHQL_WS_URL || 'ws://graphql-server.capitalis/graphql'
      }
    }
  },
  oneSignal: {
    cdn: true,
    init: {
      appId: '217eb07a-530e-4fb0-b333-0a5b27bf16fd',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: false
      }
    }
  },
  runtimeConfig: {
    public: {
      hankoApiUrl: process.env.NUXT_PUBLIC_HANKO_API_URL,
      graphqlUrl: process.env.GRAPHQL_URL,
      graphqlWsUrl: process.env.GRAPHQL_WS_URL,
      notificationServerUrl: process.env.NOTIFICATION_SERVER_URL || 'http://localhost:3001',
      oneSignalRestApiKey: process.env.NUXT_PUBLIC_ONESIGNAL_REST_API_KEY
    }
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
  hanko: {
    // You need to provide the Hanko API URL in order for it to work
    apiURL: '',
    cookieName: 'hanko',
    redirects: {
      login: '/login', // this is the default
      home: '/', // this is the default
      success: '/user', // this is a custom redirect
      followRedirect: true, // this can be set to false to always redirect to the success page
    },
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
        port: 3000,
        host: '0.0.0.0'
      }
    }
  },
  pwa: {
    manifest: {
      name: 'Capitalis AI App',
      short_name: 'Capitalis',
      description: 'Capitalis AI Application',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      display: 'standalone',
      background_color: '#ffffff',
      start_url: '/',
      scope: '/',
      orientation: 'portrait',
      categories: ['business', 'finance'],
      shortcuts: [
        {
          name: 'Dashboard',
          url: '/dashboard',
          description: 'View your dashboard'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globDirectory: '.output/public',
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico}'],
      globIgnores: [
        '**/node_modules/**/*',
        'sw.js',
        'workbox-*.js'
      ],
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
        },
        {
          urlPattern: /\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 5 // Cache for 5 minutes
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    strategies: 'generateSW',
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  typescript: {
    strict: true
  }
})