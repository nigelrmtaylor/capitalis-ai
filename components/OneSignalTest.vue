<template>
  <div class="p-4 border rounded-lg bg-white shadow-sm">
    <h2 class="text-xl font-semibold mb-4">OneSignal Notifications</h2>
    
    <div v-if="!isSupported" class="text-red-600 mb-4">
      Push notifications are not supported in this browser.
    </div>
    
    <div v-else>
      <div class="mb-4">
        <p class="mb-2">Status: {{ isSubscribed ? 'Subscribed' : 'Not Subscribed' }}</p>
        <p v-if="userId" class="mb-2">User ID: {{ userId }}</p>
      </div>

      <button
        v-if="!isSubscribed"
        @click="requestPermission"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Enable Notifications
      </button>

      <div v-else class="space-y-4">
        <div class="space-y-2">
          <input
            v-model="title"
            placeholder="Notification Title"
            class="w-full p-2 border rounded"
          />
          <textarea
            v-model="message"
            placeholder="Notification Message"
            class="w-full p-2 border rounded"
            rows="3"
          ></textarea>
          <input
            v-model="url"
            placeholder="URL (optional)"
            class="w-full p-2 border rounded"
          />
        </div>

        <button
          @click="sendTestNotification"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
        >
          Send Test Notification
        </button>

        <button
          @click="sendToAll"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Send to All Users
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

const title = ref('')
const message = ref('')
const url = ref('')

const { isSupported, isSubscribed, userId, requestPermission, sendNotification, sendToAllUsers } = useNotifications()

async function sendTestNotification() {
  try {
    await sendNotification(title.value, {
      body: message.value,
      url: url.value || undefined
    })
    title.value = ''
    message.value = ''
    url.value = ''
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}

async function sendToAll() {
  try {
    await sendToAllUsers(title.value, message.value, {
      url: url.value || undefined
    })
    title.value = ''
    message.value = ''
    url.value = ''
  } catch (error) {
    console.error('Failed to send notification to all users:', error)
  }
}
</script>
