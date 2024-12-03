import { Hanko } from '@teamhanko/hanko-elements'
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useHanko = () => {
  const hankoInstance = ref<Hanko | null>(null)

  const initHanko = () => {
    if (!hankoInstance.value) {
      const config = useRuntimeConfig()
      const hankoApi = config.public.hankoApi
      if (!hankoApi) {
        throw new Error('Hanko API URL not configured')
      }
      hankoInstance.value = new Hanko(hankoApi)
    }
    return hankoInstance.value
  }

  return initHanko()
}
