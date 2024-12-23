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
    '@vite-pwa/nuxt'
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
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