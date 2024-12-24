<template>
  <v-footer app color="primary">
    <v-row no-gutters>
      <v-col cols="auto" class="mr-auto">
        <span class="text-caption text-white">&copy; {{ new Date().getFullYear() }} Capitalis AI</span>
      </v-col>
      
      <ClientOnly>
        <v-col cols="auto" class="px-4">
          <v-icon
            :color="isOnline ? 'green-lighten-3' : 'red-lighten-3'"
            size="small"
            class="mr-1"
          >
            {{ isOnline ? 'mdi-cloud-check' : 'mdi-cloud-off-outline' }}
          </v-icon>
          <span class="text-caption text-white">{{ isOnline ? 'Online' : 'Offline' }}</span>
        </v-col>
      </ClientOnly>

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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { Ref } from 'vue'
import { useDisplay } from 'vuetify'

const commitHash = import.meta.env.VITE_GIT_COMMIT || ''
const version = ref('v1.0.0')
const isOnline = ref(true)
const currentTime = ref('')
const commitTime = ref(import.meta.env.VITE_COMMIT_TIME || 'Unknown')
const timeInterval = ref<NodeJS.Timer | null>(null)

const { name: currentBreakpoint } = useDisplay()

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

const updateTime = () => {
  if (process.client) {
    currentTime.value = new Date().toLocaleTimeString()
  }
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
  if (process.client) {
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
