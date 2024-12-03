import { Hanko } from '@teamhanko/hanko-elements'
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useHanko = () => {
  const hankoInstance = ref<Hanko | null>(null)

  const initHanko = () => {
    if (!hankoInstance.value) {
      const config = useRuntimeConfig()
      console.log('Runtime config:', config) 
      const hankoApiUrl = config.public.NUXT_PUBLIC_HANKO_API_URL
      if (!hankoApiUrl) {
        console.error('Hanko API URL not found in config:', config) 
        throw new Error('Hanko API URL not configured')
      }
      console.log('Using Hanko API URL:', hankoApiUrl) 
      hankoInstance.value = new Hanko({api:hankoApiUrl})
    }
    return hankoInstance.value
  }

  return initHanko()
}
