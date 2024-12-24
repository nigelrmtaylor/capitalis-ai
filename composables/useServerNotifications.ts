const NOTIFICATION_SERVER_URL = '';

export const useServerNotifications = () => {
  const config = useRuntimeConfig()
  const NOTIFICATION_SERVER_URL = config.public.notificationServerUrl;
  const { isSupported } = useNotifications();
  const subscription = ref<PushSubscription | null>(null);
  const userId = ref<string | null>(null); // You should implement proper user identification

  const convertVapidKey = (vapidKey: string) => {
    const padding = '='.repeat((4 - (vapidKey.length % 4)) % 4);
    const base64 = (vapidKey + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    try {
      if (!isSupported()) {
        throw new Error('Push notifications are not supported');
      }

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        subscription.value = existingSubscription;
        return existingSubscription;
      }

      const response = await fetch(`${NOTIFICATION_SERVER_URL}/vapid-public-key`);
      const vapidPublicKey = await response.text();
      
      const convertedVapidKey = convertVapidKey(vapidPublicKey);
      
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      subscription.value = newSubscription;

      // Send subscription to server
      await fetch(`${NOTIFICATION_SERVER_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: newSubscription,
          userId: userId.value
        }),
      });

      return newSubscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  };

  const unsubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        await existingSubscription.unsubscribe();
        subscription.value = null;

        // Notify server about unsubscription
        await fetch(`${NOTIFICATION_SERVER_URL}/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription: existingSubscription,
            userId: userId.value
          }),
        });
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  };

  const sendNotification = async (title: string, options: NotificationOptions = {}) => {
    try {
      if (!subscription.value) {
        throw new Error('No active subscription');
      }

      await fetch(`${NOTIFICATION_SERVER_URL}/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.value,
          notification: {
            title,
            ...options
          },
          userId: userId.value
        }),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  };

  return {
    isSupported,
    subscribe,
    unsubscribe,
    sendNotification,
    subscription: readonly(subscription)
  };
};
