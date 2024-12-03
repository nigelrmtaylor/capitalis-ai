import { Hanko } from '@teamhanko/hanko-elements'
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useHanko = () => {
  const hankoInstance = ref<Hanko | null>(null)

  const initHanko = () => {
    if (!hankoInstance.value) {
      const config = useRuntimeConfig()
      console.log('Runtime config:', config) 
      const hankoApi = config.public.NUXT_PUBLIC_HANKO_API_URL
      if (!hankoApi) {
        console.error('Hanko API URL not found in config:', config) 
        throw new Error('Hanko API URL not configured')
      }
      console.log('Using Hanko API URL:', hankoApi) 
      hankoInstance.value = new Hanko(hankoApi)
    }
    return hankoInstance.value
  }

  return initHanko()
}
