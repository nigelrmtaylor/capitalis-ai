declare global {
  interface Window {
    OneSignal: any;
  }
}

// Extend NuxtApp type for $oneSignal
import { NuxtApp } from '#app'

declare module '#app' {
  interface NuxtApp {
    $oneSignal: {
      requestPermission: () => Promise<any>
      getUserId: () => Promise<string | null>
      createNotification: (options: { title: string; message: string; url?: string; icon?: string }) => Promise<any>
      sendToUser: (userId: string, options: { title: string; message: string; url?: string; icon?: string }) => Promise<any>
      registerForPushNotifications: () => Promise<any>
    }
  }
}
export {};