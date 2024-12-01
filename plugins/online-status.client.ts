import { ref } from 'vue'

export default defineNuxtPlugin(() => {
  console.log('Online Status Plugin - Initializing');
  
  const online = ref(true)  // Default to true
  
  // Function to check online status
  const checkOnlineStatus = async () => {
    try {
      // Try to fetch a small resource to confirm connectivity
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      online.value = response.ok;
      console.log('Online status check result:', online.value);
    } catch (error) {
      console.log('Online status check failed:', error);
      online.value = false;
    }
  };

  if (typeof window !== 'undefined') {
    // Initial check
    checkOnlineStatus();
    
    // Set up event listeners
    window.addEventListener('online', () => {
      console.log('Online event triggered');
      checkOnlineStatus();
    });
    
    window.addEventListener('offline', () => {
      console.log('Offline event triggered');
      online.value = false;
    });

    // Periodic check every 30 seconds
    setInterval(checkOnlineStatus, 30000);
  }

  return {
    provide: {
      online
    }
  }
})
