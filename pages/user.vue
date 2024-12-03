<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            User Profile
          </v-card-title>
          <v-card-text>
            <div v-if="loading" class="d-flex justify-center align-center pa-4">
              <v-progress-circular indeterminate color="primary" />
            </div>
            <div v-else>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-email" />
                  </template>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="logout"
            >
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineOptions({
  ssr: false
})

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHanko } from '#imports'

const router = useRouter()
const loading = ref(true)
const userEmail = ref('')
const hanko = useHanko()

onMounted(async () => {
  try {
    const user = await hanko?.user.getCurrent()
    userEmail.value = user?.email || ''
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    loading.value = false
  }
})

async function logout() {
  try {
    await hanko?.user.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

definePageMeta({
  middleware: ['hanko-logged-in']
})
</script>
