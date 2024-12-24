import * as Sentry from '@sentry/vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const app = nuxtApp.vueApp

  // Initialize Sentry
  Sentry.init({
    app,
    dsn: config.public.sentryDsn,
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracingOrigins: ['localhost', 'capitalis.ai', /^\//],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  })

  // Register error handler
  app.config.errorHandler = (error, instance, info) => {
    Sentry.captureException(error, {
      extra: {
        componentName: instance?.$.type?.name,
        info,
      },
    })
  }
})
