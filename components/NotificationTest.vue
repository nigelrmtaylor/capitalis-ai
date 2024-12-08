<template>
  <div>
    <v-btn
      :disabled="!isNotificationSupported"
      @click="requestNotificationPermission"
      color="primary"
      class="mb-4"
    >
      {{ hasPermission ? 'Notifications Enabled' : 'Enable Notifications' }}
    </v-btn>

    <v-btn
      v-if="hasPermission"
      @click="sendTestNotification"
      color="secondary"
      class="ml-2"
    >
      Send Test Notification
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const { isSupported, requestPermission, showNotification } = useNotifications()
const hasPermission = ref(false)
const isNotificationSupported = computed(() => isSupported())

async function requestNotificationPermission() {
  hasPermission.value = await requestPermission()
}

async function sendTestNotification() {
  await showNotification('Capitalis AI', {
    body: 'This is a test notification from Capitalis AI',
    tag: 'test-notification',
    data: {
      url: window.location.origin
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  })
}

// Check permission status on mount
onMounted(async () => {
  if (process.client && isSupported()) {
    hasPermission.value = Notification.permission === 'granted'
  }
})
</script>
