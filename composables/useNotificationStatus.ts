import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

export const useNotificationStatus = () => {
  const isSupported = ref(false)
  const isSubscribed = ref(false)
  const { $oneSignal } = useNuxtApp()

  const checkStatus = async () => {
    if (!process.client) {
      console.log('NotificationStatus: Not running in client mode')
      return
    }

    try {
      // First check if notifications are supported by the browser
      if (!('Notification' in window)) {
        console.log('NotificationStatus: Browser does not support notifications')
        isSupported.value = false
        isSubscribed.value = false
        return
      }

      console.log('NotificationStatus: Browser supports notifications')
      console.log('NotificationStatus: Current permission:', Notification.permission)

      // Then check if OneSignal is available
      console.log('NotificationStatus: Checking OneSignal support...')
      const supported = await $oneSignal.isSupported()
      console.log('NotificationStatus: OneSignal supported:', supported)
      
      // Update support status
      isSupported.value = supported
      if (!supported) {
        console.log('NotificationStatus: OneSignal not supported')
        isSubscribed.value = false
        return
      }

      // Check subscription status
      const enabled = await window.OneSignal.getNotificationPermission() === 'granted'
      console.log('NotificationStatus: Push notifications enabled:', enabled)
      
      isSubscribed.value = enabled
      console.log('NotificationStatus: Final status - Supported:', isSupported.value, 'Subscribed:', isSubscribed.value)
    } catch (error) {
      console.error('NotificationStatus: Error checking status:', error)
      isSupported.value = false
      isSubscribed.value = false
    }
  }

  const requestPermission = async () => {
    if (!isSupported.value) {
      console.log('NotificationStatus: Cannot request permission - notifications not supported')
      return false
    }
    
    try {
      console.log('NotificationStatus: Requesting permission...')
      const granted = await $oneSignal.requestPermission()
      console.log('NotificationStatus: Permission request result:', granted)
      await checkStatus()
      return granted
    } catch (error) {
      console.error('NotificationStatus: Error requesting permission:', error)
      return false
    }
  }

  // Initial status check
  onMounted(() => {
    if (process.client) {
      checkStatus()
      window.addEventListener('focus', checkStatus)
    }
  })

  return {
    isSupported,
    isSubscribed,
    checkStatus,
    requestPermission
  }
}
