import { Hanko } from "@teamhanko/hanko-frontend-sdk"
import { User } from "@teamhanko/hanko-frontend-sdk/dist/types"
import { useNuxtApp, useRuntimeConfig } from '#app'
import { ref } from 'vue'

// Create singleton state
const initialized = ref(false)
const user = ref<User | null>(null)
const isAuthenticated = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)

export const useHanko = () => {
  console.log('Setting up Hanko composable...')
  
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()

  // Wait for plugin to be ready
  const waitForHanko = async () => {
    let attempts = 0
    const maxAttempts = 10
    
    while (!nuxtApp.$hanko && attempts < maxAttempts) {
      console.log(`Waiting for Hanko SDK to be available... (attempt ${attempts + 1}/${maxAttempts})`)
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
    
    if (!nuxtApp.$hanko) {
      const err = 'Hanko SDK not available after waiting'
      console.error(err)
      error.value = err
      throw new Error(err)
    }
    
    if (!config.public.hankoApi) {
      const err = 'Hanko API URL is not configured'
      console.error(err)
      error.value = err
      throw new Error(err)
    }
    
    return nuxtApp.$hanko
  }

  const init = async () => {
    // Prevent multiple initializations
    if (initialized.value) {
      console.log('Hanko already initialized')
      return
    }

    console.log('Initializing Hanko auth state...')
    error.value = null
    
    try {
      loading.value = true
      const hanko = await waitForHanko()
      console.log('Hanko SDK is now available')
      
      console.log('Fetching current user...')
      const currentUser = await hanko.user.getCurrent()
      console.log('Current user:', currentUser)
      
      user.value = currentUser
      isAuthenticated.value = true
      initialized.value = true
    } catch (err) {
      console.error('Failed to get current user:', err)
      user.value = null
      isAuthenticated.value = false
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    } finally {
      loading.value = false
      console.log('Auth state:', { 
        isAuthenticated: isAuthenticated.value, 
        loading: loading.value,
        error: error.value
      })
    }
  }

  const logout = async () => {
    try {
      const hanko = await waitForHanko()
      await hanko.user.logout()
      user.value = null
      isAuthenticated.value = false
      initialized.value = false
    } catch (err) {
      console.error('Logout failed:', err)
      error.value = err instanceof Error ? err.message : 'Logout failed'
      throw err
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    init,
    logout
  }
}
