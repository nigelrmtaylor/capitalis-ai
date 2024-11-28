import { ref } from 'vue'

export default defineNuxtPlugin(() => {
  const online = ref(true)

  if (typeof window !== 'undefined') {
    online.value = navigator.onLine
    
    window.addEventListener('online', () => {
      online.value = true
    })
    
    window.addEventListener('offline', () => {
      online.value = false
    })
  }

  return {
    provide: {
      online
    }
  }
})
