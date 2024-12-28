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
          serviceWorkerPath: '/OneSignalSDKWorker.js',
          serviceWorkerParam: { scope: '/' },
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
        async getUserId() {
          if (!window.OneSignal) return null
          try {
            const deviceId = await window.OneSignal.User.PushSubscription.id
            return deviceId
          } catch (error) {
            console.error('Error getting OneSignal user ID:', error)
            return null
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
        },
        async sendToUser(userId: string, options: { title: string; message: string; url?: string; icon?: string }) {
          if (!window.OneSignal) return
          try {
            const restApiKey = config.public.oneSignalRestApiKey
            const response = await fetch('https://onesignal.com/api/v1/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${restApiKey}`
              },
              body: JSON.stringify({
                app_id: appId,
                include_player_ids: [userId],
                headings: { en: options.title },
                contents: { en: options.message },
                url: options.url || window.location.origin,
                chrome_web_icon: options.icon || '/icon.png',
                firefox_icon: options.icon || '/icon.png'
              })
            })
            const result = await response.json()
            if (!response.ok) {
              throw new Error(result.errors?.[0] || 'Failed to send notification')
            }
            return result
          } catch (error) {
            console.error('Error sending OneSignal notification to user:', error)
            throw error
          }
        }
      }
    }
  }
})
