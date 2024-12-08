<template>
  <div class="d-flex flex-column align-center gap-4">
    <v-btn
      :color="isSubscribed ? 'success' : 'primary'"
      @click="handleSubscription"
      :disabled="!isSupported"
    >
      {{ isSubscribed ? 'Unsubscribe from Notifications' : 'Subscribe to Notifications' }}
    </v-btn>

    <v-btn
      color="info"
      @click="sendTestNotification"
      :disabled="!isSubscribed"
    >
      Send Server Notification
    </v-btn>

    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ props }">
        <v-btn
          color="warning"
          v-bind="props"
          :disabled="!isSubscribed"
        >
          Send Custom Server Notification
        </v-btn>
      </template>

      <v-card>
        <v-card-title>Send Custom Notification</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="customNotification.title"
            label="Title"
            variant="outlined"
            class="mb-2"
          ></v-text-field>
          <v-textarea
            v-model="customNotification.body"
            label="Message"
            variant="outlined"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="sendCustomNotification"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const { 
  isSupported,
  subscribe,
  unsubscribe,
  sendNotification,
  subscription
} = useServerNotifications()

const isSubscribed = computed(() => !!subscription.value)
const dialog = ref(false)
const customNotification = ref({
  title: '',
  body: ''
})

async function handleSubscription() {
  try {
    if (isSubscribed.value) {
      await unsubscribe()
    } else {
      await subscribe()
    }
  } catch (error) {
    console.error('Subscription error:', error)
  }
}

async function sendTestNotification() {
  try {
    await sendNotification('Server Test', {
      body: 'This notification was sent from the server!',
      icon: '/icon.png'
    })
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

async function sendCustomNotification() {
  try {
    await sendNotification(customNotification.value.title, {
      body: customNotification.value.body,
      icon: '/icon.png'
    })
    dialog.value = false
    customNotification.value = {
      title: '',
      body: ''
    }
  } catch (error) {
    console.error('Error sending custom notification:', error)
  }
}
</script>
