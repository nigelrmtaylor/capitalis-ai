import { useNuxtApp } from '#app'

export const usePasskey = () => {
  const { $passkey } = useNuxtApp()

  if (!$passkey) {
    throw new Error('Passkey plugin not available')
  }

  return {
    isSupported: $passkey.isSupported,
    isAuthenticated: $passkey.isAuthenticated,
    username: $passkey.username,
    register: $passkey.register,
    authenticate: $passkey.authenticate,
    logout: $passkey.logout,
  }
}
