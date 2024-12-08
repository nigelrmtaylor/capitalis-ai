export const useOneSignal = () => {
  const config = useRuntimeConfig()
  const isSupported = ref(false)
  const isSubscribed = ref(false)
  const userId = ref<string | null>(null)

  onMounted(async () => {
    if (window.OneSignal) {
      isSupported.value = true
      
      try {
        // Initialize OneSignal
        await window.OneSignal.init()
        
        // Check subscription status
        const state = await window.OneSignal.getNotificationPermission()
        isSubscribed.value = state === 'granted'
        
        // Get user ID if subscribed
        if (isSubscribed.value) {
          const user = await window.OneSignal.getUserId()
          userId.value = user
        }

        // Listen for subscription changes
        window.OneSignal.on('subscriptionChange', async (isSubscribed: boolean) => {
          isSubscribed.value = isSubscribed
          if (isSubscribed) {
            userId.value = await window.OneSignal.getUserId()
          } else {
            userId.value = null
          }
        })
      } catch (error) {
        console.error('Error initializing OneSignal:', error)
      }
    }
  })

  const requestPermission = async () => {
    if (!isSupported.value) return false
    
    try {
      await window.OneSignal.showNativePrompt()
      return true
    } catch (error) {
      console.error('Error requesting permission:', error)
      return false
    }
  }

  const sendNotification = async (title: string, message: string, url?: string) => {
    if (!userId.value) return false

    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${config.public.oneSignalRestApiKey}`
        },
        body: JSON.stringify({
          app_id: '217eb07a-530e-4fb0-b333-0a5b27bf16fd',
          include_player_ids: [userId.value],
          contents: { en: message },
          headings: { en: title },
          url
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error sending notification:', error)
      return false
    }
  }

  return {
    isSupported,
    isSubscribed,
    userId,
    requestPermission,
    sendNotification
  }
}
