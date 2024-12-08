import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

export const useNotifications = () => {
  const config = useRuntimeConfig()
  const lastNotification = ref(null)
  
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

  // Subscribe to notifications for a specific user
  const subscribeToUserNotifications = (userId: string) => {
    const { onResult, onError } = useSubscription(gql`
      subscription OnUserNotification($userId: UUID!) {
        userNotification(userId: $userId) {
          id
          title
          message
          type
          createdAt
          metadata
        }
      }
    `, { userId })

    onResult(({ data }) => {
      if (data?.userNotification) {
        lastNotification.value = data.userNotification
        showNotification(data.userNotification.title, {
          body: data.userNotification.message,
          ...data.userNotification.metadata
        })
      }
    })

    onError((error) => {
      console.error('Error in notification subscription:', error)
    })

    return { lastNotification }
  }

  // Subscribe to broadcast notifications
  const subscribeToBroadcastNotifications = () => {
    const { onResult, onError } = useSubscription(gql`
      subscription OnBroadcastNotification {
        broadcastNotification {
          id
          title
          message
          type
          createdAt
          metadata
        }
      }
    `)

    onResult(({ data }) => {
      if (data?.broadcastNotification) {
        lastNotification.value = data.broadcastNotification
        showNotification(data.broadcastNotification.title, {
          body: data.broadcastNotification.message,
          ...data.broadcastNotification.metadata
        })
      }
    })

    onError((error) => {
      console.error('Error in broadcast subscription:', error)
    })

    return { lastNotification }
  }

  return {
    isSupported,
    requestPermission,
    showNotification,
    subscribeToUserNotifications,
    subscribeToBroadcastNotifications,
    lastNotification
  }
}
