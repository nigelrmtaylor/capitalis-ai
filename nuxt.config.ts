// https://nuxt.com/docs/api/configuration/nuxt-config

console.log('Environment variables during config initialization:')
console.log('NUXT_PUBLIC_HANKO_API_URL:', process.env.NUXT_PUBLIC_HANKO_API_URL)
console.log('All env:', process.env)

const config = defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  experimental: {
    payloadExtraction: false
  },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
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
  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',
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
      categories: ['business', 'finance']
    },
    workbox: {
      navigateFallback: '/',
      globDirectory: '.output/public',
      globPatterns: [
        '**/*.{js,css,html,ico,png,svg}',
        '_nuxt/**/*'
      ],
      globIgnores: [
        '**/OneSignalSDKWorker.js',
        '**/node_modules/**',
        'sw.js',
        'workbox-*.js'
      ],
      modifyURLPrefix: {
        '/_nuxt/Users/NigelTaylor/GitHub/CascadeProjects/windsurf-project/capitalis-ai-app/node_modules/nuxt/dist/app/': '/_nuxt/'
      },
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages'
          }
        },
        {
          urlPattern: ({ url }) => {
            const path = url.pathname;
            // Remove absolute path if present
            const normalizedPath = path.replace(/.*\/_nuxt\//, '/_nuxt/');
            return normalizedPath.startsWith('/_nuxt/');
          },
          handler: 'NetworkFirst',
          options: {
            cacheName: 'nuxt-assets',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 24 * 60 * 60
            },
            matchOptions: {
              ignoreSearch: true
            }
          }
        },
        {
          urlPattern: /^https:\/\/cdn\.onesignal\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'onesignal-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 30
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      type: 'module'
    }
  },
  runtimeConfig: {
    public: {
      hankoApiUrl: '',
      graphqlUrl: '',
      graphqlWsUrl: '',
      notificationServerUrl: '',
      oneSignalRestApiKey: ''
    }
  },
  devServer: {
  },
  nitro: {
    logLevel: 'debug',
    debug: true,
    routeRules: {
      '/**': { cors: true }
    },
    prerender: {
      crawlLinks: true,
      routes: ['/']
    },
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
    build: {
      rollupOptions: {
        output: {
          entryFileNames: '_nuxt/[name].js',
          chunkFileNames: '_nuxt/[name].js',
          assetFileNames: '_nuxt/[name][extname]'
        }
      }
    },
    plugins: [
      (await import('./plugins/vite-path-normalize')).default()
    ],
    server: {
      hmr: {
        port: 3000,
        host: '0.0.0.0'
      }
    }
  },
  typescript: {
    strict: true
  }
})

export default config