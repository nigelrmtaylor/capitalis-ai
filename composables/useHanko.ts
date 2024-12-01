import { Hanko } from "@teamhanko/hanko-frontend-sdk"
import { User } from "@teamhanko/hanko-frontend-sdk/dist/types"

export const useHanko = () => {
  const { $hanko } = useNuxtApp()
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(true)

  const init = async () => {
    try {
      loading.value = true
      const currentUser = await $hanko.user.getCurrent()
      user.value = currentUser
      isAuthenticated.value = true
    } catch (error) {
      console.error('Failed to get current user:', error)
      user.value = null
      isAuthenticated.value = false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await $hanko.user.logout()
      user.value = null
      isAuthenticated.value = false
      navigateTo('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const setupListeners = () => {
    if (!$hanko) return

    // Listen for auth events
    $hanko.onAuthFlowCompleted(() => {
      init()
    })

    $hanko.onSessionExpired(() => {
      user.value = null
      isAuthenticated.value = false
      navigateTo('/login')
    })
  }

  onMounted(() => {
    init()
    setupListeners()
  })

  return {
    user,
    isAuthenticated,
    loading,
    logout,
    init,
    setupListeners
  }
}
