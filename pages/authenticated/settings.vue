<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
})

import { computed } from 'vue'

import { useEntityChangeSubscription } from '~/composables/useEntityChangeSubscription'

const { entity, error: entityError } = useEntityChangeSubscription('fa27ac83-58cf-4c00-9255-b679065c76e5')
const authMessage = computed(() => 'Hello from the authenticated test page!')
const now = computed(() => new Date().toLocaleString())


</script>

<template>
  <div style="padding: 2rem;">
    <h1>Authenticated Test Page</h1>
    <p>Authenticated Message: <strong>{{ authMessage }}</strong></p>
    <p>Current time: <code>{{ now }}</code></p>
    <p>
      <span>Test computed: </span>
      <strong>{{ authMessage }}</strong>
    </p>
    <ClientOnly>
      <p>
      <span>Entity: </span>
      <strong>{{ entity }}</strong>
      entityError {{ entityError }}
    </p>
    </ClientOnly>

  </div>
</template>
