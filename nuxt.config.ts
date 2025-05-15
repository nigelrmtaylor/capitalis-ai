// https://nuxt.com/docs/api/configuration/nuxt-config

console.log('=== Environment Configuration ===')
console.log('NUXT_PUBLIC_HANKO_API_URL:', process.env.NUXT_PUBLIC_HANKO_API_URL)
console.log('NUXT_PUBLIC_SENTRY_DSN:', process.env.NUXT_PUBLIC_SENTRY_DSN)
console.log('Runtime Config will use:', {
  hankoApiUrl: process.env.NUXT_PUBLIC_HANKO_API_URL,
})
console.log('========================')
console.log('GRAPHQL_URL:', process.env.NUXT_PUBLIC_GRAPHQL_URL)
console.log('GRAPHQL_WS_URL:', process.env.NUXT_PUBLIC_GRAPHQL_WS_URL)
const config = defineNuxtConfig({
  ssr: true,
  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {

      }
    }
  },
  runtimeConfig: {
    public: {
      hankoApiUrl: process.env.NUXT_PUBLIC_HANKO_API_URL,
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
      oneSignalRestApiKey: process.env.NUXT_PUBLIC_ONESIGNAL_REST_API_KEY,
      notificationServerUrl: '',
      graphqlUrl: process.env.NUXT_PUBLIC_GRAPHQL_URL,        // <--- FIX HERE
      graphqlWsUrl: process.env.NUXT_PUBLIC_GRAPHQL_WS_URL,   // <--- AND HERE
    }
  },

  compatibilityDate: '2024-11-01',
  devtools: { 

  },
  experimental: {
    payloadExtraction: false
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/fonts.css'
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
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Capitalis AI' },
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
    '@nuxtjs/apollo',
    ['@nuxtjs/hanko', {
      apiURL: process.env.NUXT_PUBLIC_HANKO_API_URL || ''
      // You can also customise these if required
      // cookieName: 'hanko',
      // cookieSameSite: 'Lax',
      // cookieDomain: 'nuxt.com',
      // storageKey: 'hanko',
      // redirects: {
      //   login: '/login',
      //   success: '/',
      //   home: '/',
      //   followRedirect: true
      // },
      // registerComponents: true,
      // augmentContext: true,
      // components: {
      //   shadow: true,
      //   injectStyles: true,
      //   enablePasskeys: true,
      //   hidePasskeyButtonOnLogin: true,
      //   translations: {},
      //   fallbackLanguage: 'en'
      // }
    }],
    ['@vite-pwa/nuxt', {
      registerType: 'autoUpdate',
      manifest: {
        name: 'Capitalis AI',
        short_name: 'Capitalis',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {

      }
    }]
  ],
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_URL || 'https://dev.capitalis.app/graphql',
        wsEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_WS_URL || 'ws://dev.capitalis.app/graphql',
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
  }
})

export default config