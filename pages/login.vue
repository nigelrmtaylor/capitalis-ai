<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <ClientOnly>
          <v-card class="elevation-12">
            <v-card-title class="text-center text-h5 py-4">
              Sign in to Capitalis AI.
            </v-card-title>
            <v-card-text>
              <div class="text-caption mb-4">
                Hanko API URL: {{ hankoApiUrl }}
              </div>
              <div style="height: 400px;">
                <capitalis-auth @onAuthSuccess="afterLogin()" />

              </div>
            </v-card-text>
          </v-card>
        </ClientOnly>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'nuxt/app'

defineOptions({
  ssr: false
})

const config = useRuntimeConfig()
const hankoApiUrl = config.public.hankoApiUrl || process.env.NUXT_PUBLIC_HANKO_API_URL
const router = useRouter()

console.log('Hanko API URL from config:', config.public.hankoApiUrl)
console.log('Hanko API URL from env:', process.env.NUXT_PUBLIC_HANKO_API_URL)
console.log('Final Hanko API URL:', hankoApiUrl)



function afterLogin() {
  router.push("/profile")
}
</script>
