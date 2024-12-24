<template>
  <v-card>
    <v-card-title class="text-h5">Profile Name</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="saveName">
        <v-text-field
          v-model="name"
          label="Full Name"
          :rules="nameRules"
          :loading="loading"
          :disabled="loading"
          required
          hide-details="auto"
          class="mb-4"
        ></v-text-field>
        <v-btn
          color="primary"
          type="submit"
          :loading="loading"
          :disabled="!name || loading"
        >
          Save Name
        </v-btn>

        <v-snackbar
          v-model="showSnackbar"
          :color="snackbarColor"
          :timeout="3000"
        >
          {{ snackbarText }}
        </v-snackbar>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHanko } from '#imports'

const hanko = useHanko()
const name = ref('')
const loading = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length >= 2) || 'Name must be at least 2 characters',
  (v: string) => (v && v.length <= 50) || 'Name must be less than 50 characters',
  (v: string) => /^[a-zA-Z\s-']+$/.test(v) || 'Name can only contain letters, spaces, hyphens, and apostrophes'
]

// Load existing name if available
onMounted(async () => {
  loading.value = true
  try {
    const session = hanko?.session.get()
    console.log('Hanko Session:', session)

    const user = await hanko?.user.getCurrent()
    if (user) {
      // Make API call to get user details including custom data
      const response = await fetch(`${hanko?.api}/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${session?.jwt}`
        }
      })
      const userData = await response.json()
      if (userData.customData?.name) {
        name.value = userData.customData.name
      }
    }
  } catch (error) {
    console.error('Error loading user name:', error)
    showError('Failed to load name')
  } finally {
    loading.value = false
  }
})

const showError = (message: string) => {
  snackbarColor.value = 'error'
  snackbarText.value = message
  showSnackbar.value = true
}

const showSuccess = (message: string) => {
  snackbarColor.value = 'success'
  snackbarText.value = message
  showSnackbar.value = true
}

const saveName = async () => {
  if (!name.value) return

  loading.value = true
  try {
    const session = hanko?.session.get()
    console.log('Hanko Session:', session)

    const user = await hanko?.user.getCurrent()
    if (user) {
      // Update user's custom data with the name
      const response = await fetch(`${hanko?.api}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customData: {
            name: name.value.trim()
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save name')
      }

      showSuccess('Name saved successfully')
    }
  } catch (error) {
    console.error('Error saving name:', error)
    showError('Failed to save name')
  } finally {
    loading.value = false
  }
}
</script>
