<template>
  <v-footer app color="primary">
    <v-row no-gutters>
      <v-col cols="auto" class="mr-auto">
        <span class="text-caption text-white">&copy; {{ new Date().getFullYear() }} Capitalis</span>
      </v-col>
      
      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="blue-lighten-3" class="mr-1">mdi-clock-outline</v-icon>
        <span class="text-caption text-white">{{ currentTime }}</span>
      </v-col>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="orange-lighten-3" class="mr-1">mdi-memory</v-icon>
        <span class="text-caption text-white">{{ version }}</span>
      </v-col>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="purple-lighten-3" class="mr-1">mdi-monitor-screenshot</v-icon>
        <span class="text-caption text-white">{{ currentBreakpoint }}</span>
      </v-col>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="blue-lighten-3" class="mr-1">mdi-source-commit</v-icon>
        <span class="text-caption text-white">{{ commitTime }}</span>
      </v-col>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="green-lighten-3" class="mr-1">mdi-git</v-icon>
        <span v-if="commitHash" class="text-caption text-white">{{ commitHash.substring(0, 7) }}</span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

import { useNuxtApp } from '#app'

const isOnline = ref(true)
const version = ref(process.env.npm_package_version || 'Unknown')
const commitHash = ref(import.meta.env.VITE_GIT_COMMIT || 'Unknown')
const currentTime = ref('')
const commitTime = ref(import.meta.env.VITE_COMMIT_TIME || 'Unknown')
const timeInterval = ref<ReturnType<typeof setInterval> | null>(null)

const { name: currentBreakpoint } = useDisplay()

const { $oneSignal } = useNuxtApp()

const notificationStatus = computed(() => ({

}))


const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

const updateTime = () => {
  if (process.client) {
    currentTime.value = new Date().toLocaleTimeString()
  }
}



const testNotification = async () => {
  await $oneSignal.createNotification({
    title: 'Test Notification',
    message: 'This is a test notification from Capitalis AI',
    url: window.location.origin,
    icon: '/icon.png'
  })
}

onMounted(() => {
  if (process.client) {
    isOnline.value = navigator.onLine
    
    window.addEventListener('online', () => {
      isOnline.value = true
    })
    
    window.addEventListener('offline', () => {
      isOnline.value = false
    })

    updateTime()
    timeInterval.value = setInterval(updateTime, 1000)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('online', () => {
      isOnline.value = true
    })
    
    window.removeEventListener('offline', () => {
      isOnline.value = false
    })

    if (timeInterval.value) {
      clearInterval(timeInterval.value)
    }
  }
})
</script>
