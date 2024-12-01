<template>
  <v-card class="pa-4" max-width="400">
    <v-card-title class="text-center">
      {{ isRegistering ? 'Register with Passkey' : 'Login with Passkey' }}
    </v-card-title>

    <v-card-text>
      <v-alert
        v-if="!isSupported"
        type="warning"
        text="Passkeys are not supported in your browser"
      />

      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="username"
          label="Username"
          :rules="[v => !!v || 'Username is required']"
          required
        />

        <v-btn
          :loading="loading"
          :disabled="!isSupported || !username || loading"
          color="primary"
          block
          class="mt-4"
          type="submit"
        >
          {{ isRegistering ? 'Register' : 'Login' }}
        </v-btn>
      </v-form>

      <v-btn
        variant="text"
        block
        class="mt-2"
        @click="isRegistering = !isRegistering"
      >
        {{ isRegistering ? 'Already have an account? Login' : 'New user? Register' }}
      </v-btn>
    </v-card-text>

    <!-- Error Display -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ errorMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePasskey } from '~/composables/usePasskey'

const { isSupported, register, authenticate } = usePasskey()

const username = ref('')
const loading = ref(false)
const isRegistering = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isRegistering.value) {
      await register(username.value)
    } else {
      await authenticate(username.value)
    }
    // Emit success event
    emit('success')
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred'
    showError.value = true
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  (e: 'success'): void
}>()
</script>
