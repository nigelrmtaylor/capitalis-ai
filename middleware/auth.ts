import { until } from '@vueuse/core'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client-side
  if (process.server) return

  const { isAuthenticated, loading, init } = useHanko()

  try {
    // Initialize Hanko if needed
    await init()

    // Create a timeout promise
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Authentication check timed out')), 5000)
    })

    // Race between the authentication check and timeout
    await Promise.race([
      until(loading).toBe(false),
      timeout
    ])
  } catch (error) {
    console.error('Authentication error:', error)
    // On timeout or error, redirect to login for safety
    return navigateTo('/login')
  }

  // If not authenticated and not going to login page, redirect to login
  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If authenticated and going to login page, redirect to home
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})
