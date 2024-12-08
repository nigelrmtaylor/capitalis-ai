<template>
  <div>
    <h2>Apollo Test</h2>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      Result: {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { HELLO_QUERY } from '~/graphql/queries'

const { data, pending, error } = useQuery(HELLO_QUERY)
</script>
