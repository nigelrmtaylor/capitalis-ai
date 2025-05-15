import { ref } from 'vue'

// Indicator state: 'grey' (idle), 'green' (flash)
const indicatorColor = ref<'grey' | 'green'>('grey')
let timeout: ReturnType<typeof setTimeout> | null = null

export function useSubscriptionIndicator() {
  function triggerFlash(duration = 800) {
    indicatorColor.value = 'green'
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      indicatorColor.value = 'grey'
    }, duration)
  }

  return {
    indicatorColor,
    triggerFlash,
  }
}
