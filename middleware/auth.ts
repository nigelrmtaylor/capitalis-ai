import { until } from '@vueuse/core'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, loading } = useHanko()

  // Wait for authentication check to complete
  await until(loading).toBe(false)

  // If not authenticated and not going to login page, redirect to login
  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If authenticated and going to login page, redirect to home
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})
