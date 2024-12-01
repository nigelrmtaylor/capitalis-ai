import { Hanko } from "@teamhanko/hanko-frontend-sdk"
import { register } from "@teamhanko/hanko-elements"
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const hankoApi = config.public.hankoApi

  if (!hankoApi) {
    console.error('Hanko API URL is not configured')
    return
  }

  // Initialize Hanko SDK
  const hanko = new Hanko(hankoApi)

  // Register Hanko web components
  register(hankoApi).catch(console.error)

  return {
    provide: {
      hanko
    }
  }
})
