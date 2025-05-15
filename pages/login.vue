

<script setup lang="ts">
import { useRouter } from 'nuxt/app'
import { useRuntimeConfig } from '#app'

definePageMeta({
  middleware: ['hanko-logged-out'],
})

defineOptions({
  ssr: false
})

const config = useRuntimeConfig()
const hankoApiUrl = config.public.hankoApiUrl
const router = useRouter()

console.log('Hanko API URL from config:', hankoApiUrl)



function afterLogin() {
  router.push("/profile")
}
</script>

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