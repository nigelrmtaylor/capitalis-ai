<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <ClientOnly>
          <v-card class="elevation-12">
            <v-card-title class="text-center text-h5 py-4">
              Sign in to Capitalis AI
            </v-card-title>
            <v-card-text>
              <div v-if="loading" class="text-center py-4">
                <v-progress-circular indeterminate color="primary" />
              </div>
              <HankoAuth v-else />
            </v-card-text>
          </v-card>
        </ClientOnly>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineOptions({
  ssr: false
})

const { isAuthenticated, loading } = useHanko()

// Redirect to home if already authenticated
watch(isAuthenticated, (value) => {
  if (value) {
    navigateTo('/')
  }
})
</script>
