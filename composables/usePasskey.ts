// composables/usePasskey.ts
import { useNuxtApp } from '#app'
import { computed } from 'vue'

export function usePasskey() {
  const { $passkey } = useNuxtApp()

  const isSupported = computed(() => !!$passkey?.isSupported)

  const register = async (username: string) => {
    if (!$passkey?.register) throw new Error('Passkey registration not available')
    return await $passkey.register(username)
  }

  const authenticate = async (username: string) => {
    if (!$passkey?.authenticate) throw new Error('Passkey authentication not available')
    return await $passkey.authenticate(username)
  }

  return {
    isSupported,
    register,
    authenticate
  }
}

