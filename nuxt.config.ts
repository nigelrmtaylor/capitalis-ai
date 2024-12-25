// https://nuxt.com/docs/api/configuration/nuxt-config

console.log('=== Environment Configuration ===')
console.log('NUXT_PUBLIC_HANKO_API_URL:', process.env.NUXT_PUBLIC_HANKO_API_URL)
console.log('NUXT_PUBLIC_SENTRY_DSN:', process.env.NUXT_PUBLIC_SENTRY_DSN)
console.log('========================')

const config = defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  experimental: {
    payloadExtraction: false
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    ['@nigelrmtaylor/hanko-nuxt-module', {
      apiURL: ''
    }],
    '@nuxtjs/apollo',
    ['@vite-pwa/nuxt', {
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      filename: 'sw.js',
      includeAssets: ['favicon.svg', 'icons/*'],
      manifest: {
        name: 'Capitalis AI',
        short_name: 'Capitalis',
        description: 'Your AI Investment Assistant',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }]
  ],
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_URL || 'http://graphql-server.capitalis/graphql',
        wsEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_WS_URL || 'ws://graphql-server.capitalis/graphql'
      }
    }
  },
  runtimeConfig: {
    public: {
      hankoApiUrl: '',
      graphqlUrl: '',
      graphqlWsUrl: '',
      notificationServerUrl: '',
      oneSignalRestApiKey: '',
      sentryDsn: ''
    }
  },
  devServer: {
  },
  nitro: {
    logLevel: 0, // Disable Nitro logging
    routeRules: {
      '/**': { cors: true, cache: { maxAge: 60 * 60 } }
    },
    // Temporarily disable prerender
    // prerender: {
    //   crawlLinks: true,
    //   routes: ['/']
    // },
    publicAssets: [
      {
        dir: 'public',
        baseURL: '/'
      }
    ]
  },
  hanko: {
    // You need to provide the Hanko API URL in order for it to work
    apiURL: process.env.NUXT_PUBLIC_HANKO_API_URL,
    // cookieName: 'hanko',
    // redirects: {
    //   login: '/login', // this is the default
    //   home: '/', // this is the default
    //   success: '/user', // this is a custom redirect
    //   followRedirect: true, // this can be set to false to always redirect to the success page
    // },
  },
  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'Capitalis AI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Capitalis AI' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg' },
        { rel: 'apple-touch-icon', href: 'icons/apple-touch-icon.png' }
      ]
    }
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    resolve: {
      alias: {
        'tslib': 'tslib/tslib.js'
      }
    }
  },
  typescript: {
    strict: true
  }
})

export default config