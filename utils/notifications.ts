import { useNotifications } from '~/composables/useNotifications'

export async function sendNotification(title: string, message: string, options: Partial<NotificationOptions> = {}) {
  const { showNotification, requestPermission, isSupported } = useNotifications()
  
  // Check if notifications are supported
  if (!isSupported()) {
    console.warn('Notifications are not supported in this browser')
    return false
  }

  // Request permission if not already granted
  if (Notification.permission !== 'granted') {
    const permitted = await requestPermission()
    if (!permitted) {
      console.warn('Notification permission was denied')
      return false
    }
  }

  // Send the notification
  await showNotification(title, {
    body: message,
    icon: '/icon.png',
    badge: '/icon.png',
    timestamp: Date.now(),
    requireInteraction: true,
    ...options
  })

  return true
}

// Predefined notification types
export function sendSuccessNotification(message: string) {
  return sendNotification('Success', message, {
    icon: '/success-icon.png', // Make sure to have this icon
    vibrate: [200, 100, 200]
  })
}

export function sendErrorNotification(message: string) {
  return sendNotification('Error', message, {
    icon: '/error-icon.png', // Make sure to have this icon
    vibrate: [300, 100, 300]
  })
}

export function sendAlertNotification(message: string) {
  return sendNotification('Alert', message, {
    icon: '/alert-icon.png', // Make sure to have this icon
    vibrate: [100, 50, 100],
    requireInteraction: true
  })
}
