<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-card-title class="text-center text-h5 py-4">
            Sign in to Capitalis AI
          </v-card-title>
          <v-card-text>
            <HankoAuth />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
const { isAuthenticated, init, setupListeners } = useHanko()

// Initialize auth state and listeners
onMounted(() => {
  init()
  setupListeners()
})

// Redirect to home if already authenticated
watch(isAuthenticated, (value) => {
  if (value) {
    navigateTo('/')
  }
})
</script>
