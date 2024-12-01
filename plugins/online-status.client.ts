import { ref } from 'vue'

/**
 * Nuxt Plugin for Online Status Management
 * 
 * This plugin creates and manages the global online status state using navigator.onLine.
 * It provides this state to the rest of the application through Nuxt's plugin system.
 * Components can access this state using useNuxtApp().$online
 */
export default defineNuxtPlugin(() => {
  console.log('Online Status Plugin - Initializing')
  
  // Create a reactive reference to track online status
  const online = ref(true)
  console.log('Initial ref value:', online.value)

  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    // Set initial status from browser's navigator.onLine
    const initialStatus = navigator.onLine
    console.log('Browser reports online status:', initialStatus)
    online.value = initialStatus
    console.log('Set ref value to:', online.value)
    
    // Set up browser event listeners for online/offline events
    window.addEventListener('online', () => {
      console.log('Online event triggered - Current value:', online.value)
      online.value = true
      console.log('Set to true - New value:', online.value)
    })
    
    window.addEventListener('offline', () => {
      console.log('Offline event triggered - Current value:', online.value)
      online.value = false
      console.log('Set to false - New value:', online.value)
    })

    console.log('Online status event listeners registered')
  } else {
    console.log('Window or Navigator not available - Online status detection disabled')
  }

  // Provide the online status to the rest of the application
  // This can be accessed in components using useNuxtApp().$online
  console.log('Providing online status with current value:', online.value)
  return {
    provide: {
      online
    }
  }
})
