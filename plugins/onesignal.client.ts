import { defineNuxtPlugin } from '#app'

declare global {
  interface Window {
    OneSignal: any;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const appId = '217eb07a-530e-4fb0-b333-0a5b27bf16fd'

  // Only run on client-side
  if (process.client) {
    // Load OneSignal script
    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.OneSignal = window.OneSignal || []
      window.OneSignal.push(() => {
        window.OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
          welcomeNotification: {
            disable: false
          },
          notifyButton: {
            enable: true
          }
        })
      })
    }
  }

  return {
    provide: {
      oneSignal: {
        async requestPermission() {
          if (!window.OneSignal) return false
          try {
            return await window.OneSignal.Notifications.requestPermission()
          } catch (error) {
            console.error('Error requesting OneSignal permission:', error)
            return false
          }
        },
        async createNotification(options: { title: string; message: string; url?: string; icon?: string }) {
          if (!window.OneSignal) return
          try {
            await window.OneSignal.Notifications.create({
              title: options.title,
              message: options.message,
              url: options.url || window.location.origin,
              icon: options.icon || '/icon.png'
            })
          } catch (error) {
            console.error('Error creating OneSignal notification:', error)
          }
        }
      }
    }
  }
})
