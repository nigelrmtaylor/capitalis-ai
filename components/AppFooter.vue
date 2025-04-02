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
        <v-col cols="auto" class="px-4">
          <v-icon
            :color="notificationStatus.isSupported ? 'green-lighten-3' : 'grey-lighten-1'"
            size="small"
            class="mr-1"
          >
            {{ notificationStatus.isSupported ? 'mdi-bell' : 'mdi-bell-off' }}
          </v-icon>
          <span class="text-caption text-white">
            {{ notificationStatus.isSupported ? 'Notifications Supported' : 'Notifications Not Supported' }}
          </span>
        </v-col>
        <v-col cols="auto" class="px-4">
          <v-icon
            :color="notificationStatus.isSubscribed ? 'green-lighten-3' : 'grey-lighten-1'"
            size="small"
            class="mr-1"
          >
            {{ notificationStatus.isSubscribed ? 'mdi-bell' : 'mdi-bell-off' }}
          </v-icon>
          <span class="text-caption text-white">
            {{ notificationStatus.isSubscribed ? 'Notifications On' : 'Notifications Off' }}
          </span>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn
            v-if="notificationStatus.isSupported && !notificationStatus.isSubscribed"
            color="primary"
            @click="requestNotificationPermission"
          >
            Enable Notifications
          </v-btn>
          <v-btn
            v-if="notificationStatus.isSupported && notificationStatus.isSubscribed"
            color="primary"
            @click="testNotification"
          >
            Test Notification
          </v-btn>
          <!-- Debug info -->
          <div class="text-caption">
            Notifications: {{ notificationStatus.isSupported ? 'Supported' : 'Not Supported' }} | 
            Status: {{ notificationStatus.isSubscribed ? 'Subscribed' : 'Not Subscribed' }}
          </div>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useNotificationStatus } from '~/composables/useNotificationStatus'
import { useNuxtApp } from '#app'

const isOnline = ref(true)
const version = ref(process.env.npm_package_version || 'Unknown')
const commitHash = ref(import.meta.env.VITE_GIT_COMMIT || 'Unknown')
const currentTime = ref('')
const commitTime = ref(import.meta.env.VITE_COMMIT_TIME || 'Unknown')
const timeInterval = ref<NodeJS.Timer | null>(null)

const { name: currentBreakpoint } = useDisplay()
const { isSupported, isSubscribed, checkStatus, requestPermission } = useNotificationStatus()
const { $oneSignal } = useNuxtApp()

const notificationStatus = computed(() => ({
  isSupported: isSupported.value,
  isSubscribed: isSubscribed.value
}))

console.log('AppFooter: Initial notification status -', { isSupported: isSupported.value, isSubscribed: isSubscribed.value })
watch([isSupported, isSubscribed], ([newSupported, newSubscribed]) => {
  console.log('AppFooter: Notification status changed -', { isSupported: newSupported, isSubscribed: newSubscribed })
})

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

const updateTime = () => {
  if (process.client) {
    currentTime.value = new Date().toLocaleTimeString()
  }
}

const requestNotificationPermission = async () => {
  await requestPermission()
  checkStatus()
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
