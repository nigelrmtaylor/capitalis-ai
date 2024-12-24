import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  console.log('\n=== Server Starting ===')
  console.log('Node Environment:', process.env.NODE_ENV)
  console.log('Current Time:', new Date().toISOString())
  console.log('========================\n')
})
