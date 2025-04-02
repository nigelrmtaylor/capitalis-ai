import { defineNuxtPlugin } from '#app'

declare global {
  interface Window {
    OneSignal: any;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const appId = '217eb07a-530e-4fb0-b333-0a5b27bf16fd'
  let isInitialized = false
  let initializationPromise: Promise<boolean> | null = null

  const initialize = async () => {
    // If already initialized, return true
    if (isInitialized && window.OneSignal) {
      console.log('OneSignal: Already initialized')
      return true
    }

    // If initialization is in progress, wait for it
    if (initializationPromise) {
      console.log('OneSignal: Initialization in progress, waiting...')
      return initializationPromise
    }

    initializationPromise = new Promise((resolve) => {
      if (!process.client) {
        console.log('OneSignal: Not in client mode')
        resolve(false)
        return
      }

      console.log('OneSignal: Starting initialization')
      // Load OneSignal script if not already loaded
      if (!window.OneSignal) {
        console.log('OneSignal: Loading script')
        const script = document.createElement('script')
        script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
        script.async = true
        
        script.onload = () => {
          console.log('OneSignal: Script loaded')
          window.OneSignal = window.OneSignal || []
          window.OneSignal.push(() => {
            if (!isInitialized) {
              console.log('OneSignal: Configuring')
              window.OneSignal.init({
                appId,
                allowLocalhostAsSecureOrigin: true,
                notificationClickHandlerMatch: 'origin',
                serviceWorkerParam: { scope: '/' },
                welcomeNotification: {
                  disable: false
                },
                notifyButton: {
                  enable: false
                }
              }).then(() => {
                console.log('OneSignal: Successfully initialized')
                isInitialized = true
                resolve(true)
              }).catch((error) => {
                console.error('OneSignal: Error during initialization:', error)
                isInitialized = false
                resolve(false)
              })
            } else {
              console.log('OneSignal: Already initialized during script load')
              resolve(true)
            }
          })
        }

        script.onerror = (error) => {
          console.error('OneSignal: Failed to load script:', error)
          isInitialized = false
          initializationPromise = null
          resolve(false)
        }

        document.body.appendChild(script)
      } else {
        console.log('OneSignal: Script already loaded')
        // Check if OneSignal is already initialized by checking for the presence of certain methods
        if (typeof window.OneSignal.isPushNotificationsEnabled === 'function') {
          console.log('OneSignal: Already fully initialized')
          isInitialized = true
          resolve(true)
        } else {
          console.log('OneSignal: Script loaded but not initialized')
          window.OneSignal.push(() => {
            if (!isInitialized) {
              console.log('OneSignal: Initializing')
              window.OneSignal.init({
                appId,
                allowLocalhostAsSecureOrigin: true,
                notificationClickHandlerMatch: 'origin',
                serviceWorkerParam: { scope: '/' },
                welcomeNotification: {
                  disable: false
                },
                notifyButton: {
                  enable: false
                }
              }).then(() => {
                console.log('OneSignal: Successfully initialized')
                isInitialized = true
                resolve(true)
              }).catch((error) => {
                console.error('OneSignal: Error during initialization:', error)
                isInitialized = false
                initializationPromise = null
                resolve(false)
              })
            } else {
              console.log('OneSignal: Already initialized during check')
              resolve(true)
            }
          })
        }
      }
    })

    const result = await initializationPromise
    if (!result) {
      initializationPromise = null
    }
    return result
  }

  // Initialize immediately
  if (process.client) {
    console.log('OneSignal: Auto-initializing')
    initialize().then((success) => {
      console.log('OneSignal: Auto-initialization result:', success)
    })
  }

  return {
    provide: {
      oneSignal: {
        async isSupported() {
          try {
            // Check if notifications are supported by the browser first
            if (!process.client) {
              console.log('OneSignal.isSupported: Not running in client mode')
              return false
            }
            if (!('Notification' in window)) {
              console.log('OneSignal.isSupported: Browser does not support notifications')
              return false
            }

            // Check if we're in a secure context (required for notifications)
            if (!window.isSecureContext) {
              console.log('OneSignal.isSupported: Not in a secure context')
              return false
            }
            
            // Then check if OneSignal is initialized
            console.log('OneSignal.isSupported: Checking initialization...')
            const initialized = await initialize()
            console.log('OneSignal.isSupported: Initialization status:', initialized)
            console.log('OneSignal.isSupported: Window.OneSignal available:', !!window.OneSignal)
            
            if (!initialized || !window.OneSignal) {
              console.log('OneSignal.isSupported: OneSignal not available')
              return false
            }

            // Check if service workers are supported
            if (!('serviceWorker' in navigator)) {
              console.log('OneSignal.isSupported: Service workers not supported')
              return false
            }

            // Check if we have permission to send notifications
            const permission = await new Promise<string>((resolve) => {
              window.OneSignal.push(() => {
                window.OneSignal.getNotificationPermission((permission) => {
                  resolve(permission)
                })
              })
            })
            console.log('OneSignal.isSupported: Current permission:', permission)

            // Check if push notifications are enabled
            const enabled = await new Promise<boolean>((resolve) => {
              window.OneSignal.push(() => {
                window.OneSignal.isPushNotificationsEnabled((enabled) => {
                  console.log('OneSignal.isSupported: Push notifications enabled:', enabled)
                  resolve(enabled)
                })
              })
            })
            
            return true
          } catch (error) {
            console.error('OneSignal.isSupported: Error checking support:', error)
            return false
          }
        },

        async getPermissionState() {
          const initialized = await initialize()
          if (!initialized) return 'denied'
          
          try {
            return await new Promise<string>((resolve) => {
              window.OneSignal.push(() => {
                window.OneSignal.getNotificationPermission((permission) => {
                  console.log('OneSignal: Got permission state:', permission)
                  resolve(permission)
                })
              })
            })
          } catch (error) {
            console.error('OneSignal: Error getting permission state:', error)
            return 'denied'
          }
        },

        async requestPermission() {
          const initialized = await initialize()
          if (!initialized) {
            console.log('OneSignal: Cannot request permission - not initialized')
            return false
          }

          try {
            console.log('OneSignal: Requesting permission...')
            return await new Promise<boolean>((resolve) => {
              window.OneSignal.push(() => {
                window.OneSignal.registerForPushNotifications({
                  modalPrompt: true
                }).then(() => {
                  console.log('OneSignal: Permission granted')
                  resolve(true)
                }).catch((error) => {
                  console.error('OneSignal: Error in registerForPushNotifications:', error)
                  resolve(false)
                })
              })
            })
          } catch (error) {
            console.error('OneSignal: Error requesting permission:', error)
            return false
          }
        },

        async getUserId() {
          const initialized = await initialize()
          if (!initialized) return null

          try {
            return await window.OneSignal.User.PushSubscription.id
          } catch (error) {
            console.error('Error getting OneSignal user ID:', error)
            return null
          }
        },

        async createNotification(options: { title: string; message: string; url?: string; icon?: string }) {
          const initialized = await initialize()
          if (!initialized) {
            console.error('OneSignal: Cannot create notification - not initialized')
            return false
          }

          try {
            console.log('OneSignal: Creating notification:', options)
            return await new Promise((resolve) => {
              window.OneSignal.push(() => {
                window.OneSignal.sendSelfNotification(
                  options.title,
                  options.message,
                  options.url || window.location.origin,
                  options.icon || '/icon.png',
                  {},
                  {}
                ).then(() => {
                  console.log('OneSignal: Notification sent successfully')
                  resolve(true)
                }).catch((error) => {
                  console.error('OneSignal: Error sending notification:', error)
                  resolve(false)
                })
              })
            })
          } catch (error) {
            console.error('OneSignal: Error creating notification:', error)
            return false
          }
        }
      }
    }
  }
})
