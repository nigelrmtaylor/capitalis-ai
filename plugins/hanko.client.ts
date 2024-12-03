import { defineNuxtPlugin } from '#app'
import { Hanko, register } from "@teamhanko/hanko-elements"

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const hankoApi = config.public.hankoApi

  if (process.client) {
    try {
      await register(hankoApi)
      const hanko = new Hanko(hankoApi)
      
      nuxtApp.provide('hanko', hanko)
    } catch (error) {
      console.error('Failed to initialize Hanko:', error)
    }
  }
})
