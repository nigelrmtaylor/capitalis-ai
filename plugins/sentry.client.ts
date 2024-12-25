import * as Sentry from '@sentry/vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const dsn = config.public.sentryDsn

  // Use standard logging
  console.log('=== Sentry Configuration ===')
  console.log('Initializing Sentry with DSN:', dsn)
  console.log('Environment:', process.env.NODE_ENV)
  console.log('========================')

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: dsn,
    integrations: [
      new Sentry.BrowserTracing({
        tracingOrigins: ['localhost', 'my-site-url.com', /^\//],
      }),
    ],
    debug: true,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  })

  nuxtApp.vueApp.mixin({
    beforeCreate() {
      const options = this.$options
      if (options.name) {
        Sentry.setTag('vue_component', options.name)
      }
    },
  })

  // Add error handler
  nuxtApp.vueApp.config.errorHandler = (error, vm, info) => {
    console.error('Vue error caught:', error)
    Sentry.captureException(error, {
      extra: {
        componentName: vm?.$options?.name,
        info,
      },
    })
  }
})
