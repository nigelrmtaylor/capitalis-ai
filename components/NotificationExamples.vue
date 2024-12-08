<template>
  <div class="d-flex flex-column align-center gap-4">
    <v-btn
      color="success"
      @click="sendTestSuccess"
      :disabled="!isNotificationSupported"
    >
      Send Success Notification
    </v-btn>

    <v-btn
      color="error"
      @click="sendTestError"
      :disabled="!isNotificationSupported"
    >
      Send Error Notification
    </v-btn>

    <v-btn
      color="warning"
      @click="sendTestAlert"
      :disabled="!isNotificationSupported"
    >
      Send Alert Notification
    </v-btn>

    <v-btn
      color="info"
      @click="sendCustomNotification"
      :disabled="!isNotificationSupported"
    >
      Send Custom Notification
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { 
  sendSuccessNotification, 
  sendErrorNotification, 
  sendAlertNotification,
  sendNotification 
} from '~/utils/notifications'

const { isSupported } = useNotifications()
const isNotificationSupported = computed(() => isSupported())

async function sendTestSuccess() {
  await sendSuccessNotification('Your operation was completed successfully!')
}

async function sendTestError() {
  await sendErrorNotification('Something went wrong. Please try again.')
}

async function sendTestAlert() {
  await sendAlertNotification('Your attention is required!')
}

async function sendCustomNotification() {
  await sendNotification(
    'Custom Notification',
    'This is a custom notification with actions!',
    {
      actions: [
        {
          action: 'open',
          title: 'Open App'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ],
      data: {
        url: window.location.origin
      },
      tag: 'custom-notification',
      renotify: true
    }
  )
}
</script>
