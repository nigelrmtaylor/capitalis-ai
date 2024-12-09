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
import { useHanko } from '@nigelrmtaylor/hanko-nuxt-module'

defineOptions({
  ssr: false
})

const config = useRuntimeConfig()
const hanko = useHanko()
const hankoApiUrl = hanko.apiURL
const router = useRouter()

console.log('Hanko API URL from module:', hankoApiUrl)



function afterLogin() {
  router.push("/profile")
}
</script>
