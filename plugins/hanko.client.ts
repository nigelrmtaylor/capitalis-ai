import { Hanko } from "@teamhanko/hanko-frontend-sdk"
import { register } from "@teamhanko/hanko-elements"
import { defineNuxtPlugin } from '#app'
import { useRuntimeConfig } from '#app'

// Global variable to track initialization state
let isInitializing = false
let hankoInstance: Hanko | null = null

export default defineNuxtPlugin(async (nuxtApp) => {
  // Only run in client
  if (!process.client) {
    console.log('Skipping Hanko initialization - server side')
    return {
      provide: {
        hanko: null
      }
    }
  }

  console.log('Initializing Hanko plugin...')
  
  if (hankoInstance) {
    console.log('Returning existing Hanko instance')
    return {
      provide: {
        hanko: hankoInstance
      }
    }
  }

  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    console.log('Hanko initialization already in progress...')
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    if (hankoInstance) {
      return {
        provide: {
          hanko: hankoInstance
        }
      }
    }
  }
  
  isInitializing = true
  
  try {
    const config = useRuntimeConfig()
    console.log('Runtime config loaded')
    
    const hankoApi = config.public.hankoApi
    console.log('Hanko API URL:', hankoApi)

    if (!hankoApi) {
      throw new Error('Hanko API URL is not configured')
    }

    // Get the current origin
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    console.log('Current origin:', origin)

    // Initialize Hanko SDK with CORS settings
    hankoInstance = new Hanko(hankoApi, {
      timeout: 10000, // 10 second timeout
      cookieName: 'hanko',
      localStorageKey: 'hanko',
      headers: {
        'Origin': origin
      }
    })
    console.log('Hanko SDK initialized successfully')

    // Register Hanko web components with CORS settings
    await register(hankoApi, {
      shadow: true,
      injectStyles: true
    }).catch(error => {
      console.error('Failed to register Hanko web components:', error)
      throw error
    })
    console.log('Hanko web components registered successfully')

    // Add unload handler
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => {
        console.log('Cleaning up Hanko instance')
        hankoInstance = null
      })
    }

    return {
      provide: {
        hanko: hankoInstance
      }
    }
  } catch (error) {
    console.error('Failed to initialize Hanko:', error)
    hankoInstance = null
    throw error
  } finally {
    isInitializing = false
  }
})
