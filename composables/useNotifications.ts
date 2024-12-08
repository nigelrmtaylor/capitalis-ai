export const useNotifications = () => {
  const config = useRuntimeConfig()
  
  const isSupported = () => {
    return typeof window !== 'undefined' && 'OneSignal' in window
  }

  const requestPermission = async () => {
    if (!isSupported()) {
      console.warn('OneSignal is not supported')
      return false
    }

    try {
      const permission = await window.OneSignal.Notifications.requestPermission()
      return permission
    } catch (error) {
      console.error('Error requesting OneSignal notification permission:', error)
      return false
    }
  }

  const showNotification = async (title: string, options: any = {}) => {
    if (!isSupported()) {
      console.warn('OneSignal is not supported')
      return
    }

    try {
      await window.OneSignal.Notifications.create({
        title,
        message: options.body,
        icon: options.icon || '/icon.png',
        url: options.url || window.location.origin,
        ...options
      })
    } catch (error) {
      console.error('Error showing OneSignal notification:', error)
    }
  }

  return {
    isSupported,
    requestPermission,
    showNotification,
  }
}
