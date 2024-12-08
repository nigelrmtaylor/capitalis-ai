<template>
  <v-footer app class="bg-grey-lighten-1">
    <v-row no-gutters>
      <v-col cols="auto" class="mr-auto">
        <span class="text-caption">&copy; {{ new Date().getFullYear() }} Capitalis AI</span>
      </v-col>
      
      <ClientOnly>
        <v-col cols="auto" class="px-4">
          <v-icon
            :color="onlineStatus ? 'green' : 'red'"
            size="small"
            class="mr-1"
          >
            {{ onlineStatus ? 'mdi-cloud-check' : 'mdi-cloud-off-outline' }}
          </v-icon>
          <span class="text-caption">{{ onlineStatus ? 'Online' : 'Offline' }}</span>
        </v-col>
      </ClientOnly>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="blue" class="mr-1">mdi-clock-outline</v-icon>
        <span class="text-caption">{{ currentTime }}</span>
      </v-col>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="orange" class="mr-1">mdi-memory</v-icon>
        <span class="text-caption">{{ version }}</span>
      </v-col>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="purple" class="mr-1">mdi-monitor-screenshot</v-icon>
        <span class="text-caption">{{ currentBreakpoint }}</span>
      </v-col>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="blue" class="mr-1">mdi-source-commit</v-icon>
        <span class="text-caption">{{ commitTime }}</span>
      </v-col>

      <v-col cols="auto" class="px-4">
        <v-icon size="small" color="green" class="mr-1">mdi-git</v-icon>
        <span v-if="commitHash" class="text-caption">{{ commitHash.substring(0, 7) }}</span>
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
const onlineStatus = ref(navigator.onLine)
const currentTime = ref(new Date().toLocaleTimeString())
const commitTime = ref(import.meta.env.VITE_COMMIT_TIME || 'Unknown')

const { name: currentBreakpoint } = useDisplay()

const updateOnlineStatus = () => {
  onlineStatus.value = navigator.onLine
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString()
}

let timeInterval: NodeJS.Timer

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
  clearInterval(timeInterval)
})
</script>
