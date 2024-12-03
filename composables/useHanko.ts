import { Hanko } from '@teamhanko/hanko-elements'
import { ref } from 'vue'

export const useHanko = () => {
  const hankoInstance = ref<Hanko | null>(null)

  const initHanko = () => {
    if (!hankoInstance.value) {
      const hankoApi = process.env.NUXT_PUBLIC_HANKO_API_URL
      if (!hankoApi) {
        throw new Error('Hanko API URL not configured')
      }
      hankoInstance.value = new Hanko(hankoApi)
    }
    return hankoInstance.value
  }

  return initHanko()
}
