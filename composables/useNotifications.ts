export const useNotifications = () => {
  const isSupported = () => {
    return 'Notification' in window && 'serviceWorker' in navigator
  }

  const requestPermission = async () => {
    if (!isSupported()) {
      console.warn('Notifications are not supported')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const showNotification = async (title: string, options: NotificationOptions = {}) => {
    if (!isSupported()) {
      console.warn('Notifications are not supported')
      return
    }

    const registration = await navigator.serviceWorker.ready
    try {
      await registration.showNotification(title, {
        icon: '/icon.png',
        badge: '/icon.png',
        ...options,
      })
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }

  return {
    isSupported,
    requestPermission,
    showNotification,
  }
}
