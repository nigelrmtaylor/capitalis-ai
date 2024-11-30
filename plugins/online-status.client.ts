import { ref } from 'vue'

export default defineNuxtPlugin(() => {
  console.log('Online Status Plugin - Initializing');
  console.log('Window exists:', typeof window !== 'undefined');
  console.log('Navigator exists:', typeof navigator !== 'undefined');
  console.log('Navigator object:', navigator);
  console.log('onLine property exists:', navigator && 'onLine' in navigator);
  
  const online = ref(true)

  if (typeof window !== 'undefined' && 
      typeof navigator !== 'undefined' && 
      'onLine' in navigator) {
    
    console.log('Setting initial online status:', navigator.onLine);
    online.value = navigator.onLine
    
    window.addEventListener('online', () => {
      console.log('Online event triggered');
      online.value = true
    })
    
    window.addEventListener('offline', () => {
      console.log('Offline event triggered');
      online.value = false
    })
  } else {
    console.log('Online status check skipped - missing required objects');
  }

  // Check for service worker
  if ('serviceWorker' in navigator) {
    console.log('Service Worker is available');
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('Active Service Workers:', registrations.length);
      registrations.forEach(registration => {
        console.log('SW scope:', registration.scope);
      });
    });
  }

  return {
    provide: {
      online
    }
  }
})
