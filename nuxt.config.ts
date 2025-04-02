// https://nuxt.com/docs/api/configuration/nuxt-config

console.log('=== Environment Configuration ===')
console.log('NUXT_PUBLIC_HANKO_API_URL:', process.env.NUXT_PUBLIC_HANKO_API_URL)
console.log('NUXT_PUBLIC_SENTRY_DSN:', process.env.NUXT_PUBLIC_SENTRY_DSN)
console.log('Runtime Config will use:', {
  hankoApiUrl: process.env.NUXT_PUBLIC_HANKO_API_URL,
})
console.log('========================')

const config = defineNuxtConfig({
  runtimeConfig: {
    public: {
      hankoApiUrl: process.env.NUXT_PUBLIC_HANKO_API_URL,
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
      oneSignalRestApiKey: process.env.NUXT_PUBLIC_ONESIGNAL_REST_API_KEY,
      notificationServerUrl: '',
      graphqlUrl: '',
      graphqlWsUrl: '',
    }
  },
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
        // Apple PWA meta tags
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Capitalis AI' },
        // Apple splash screen images
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icons/icon.svg' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/icons/apple-touch-icon-152x152.png' },
        { rel: 'apple-touch-icon', sizes: '167x167', href: '/icons/apple-touch-icon-167x167.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon-180x180.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/icons/apple-touch-icon-120x120.png' },
        { rel: 'apple-touch-startup-image', href: '/icons/apple-splash-2048x2732.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)' },
        { rel: 'apple-touch-startup-image', href: '/icons/apple-splash-1668x2224.png', media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)' },
        { rel: 'apple-touch-startup-image', href: '/icons/apple-splash-1536x2048.png', media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)' },
        { rel: 'apple-touch-startup-image', href: '/icons/apple-splash-1125x2436.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)' },
        { rel: 'apple-touch-startup-image', href: '/icons/apple-splash-1242x2208.png', media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)' },
        { rel: 'apple-touch-startup-image', href: '/icons/apple-splash-750x1334.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' },
      ]
    }
  },
  modules: [
    ['@nuxtjs/hanko', {
      apiURL: process.env.NUXT_PUBLIC_HANKO_API_URL || ''
    }],
    '@nuxtjs/apollo',
    ['@vite-pwa/nuxt', {
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      filename: 'sw.js',
      includeAssets: ['icons/*'],
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        cleanupOutdatedCaches: true,
        sourcemap: false,
        disableDevLogs: true
      },
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
            src: '/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      client: {
        installPrompt: true,
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        type: 'module',
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