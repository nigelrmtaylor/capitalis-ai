<script setup lang="ts">
// definePageMeta({
//   middleware: ["authenticated"],
// });
console.log('Dashboard page loaded');
import { useRuntimeConfig } from '#imports' // Nuxt 3 composable for runtime config
import { useCorePeopleQuery } from '~/composables/useCorePeopleQuery'
import { useEntityChangeSubscription } from '~/composables/useEntityChangeSubscription'

const { entity, error: entityError } = useEntityChangeSubscription('fa27ac83-58cf-4c00-9255-b679065c76e5')
const { people, loading: peopleLoading, error: peopleError } = useCorePeopleQuery()

const config = useRuntimeConfig()
// const httpEndpoint = config.public.graphqlUrl || 'NOT SET'
// const wsEndpoint = config.public.graphqlWsUrl || 'NOT SET'
const httpEndpoint = computed(() => config.public.graphqlUrl || 'NOT SET')

const wsEndpoint = computed(() => config.public.graphqlWsUrl || 'NOT SET')

const bob = computed(() : string   => {
  return 'bobby'
})

console.log('Runtime config in browser config:', config)
console.log('Runtime config in browser public:', config.public)
console.log('Runtime config in browser public graphqlUrl:', config.public.graphqlUrl)
console.log('Runtime config in browser public graphqlWsUrl:', config.public.graphqlWsUrl)
console.log('httpEndpoint:', httpEndpoint.value)
console.log('wsEndpoint:', wsEndpoint.value)

</script>

<template>
  <div>
    www{{ bob }}www
    <h2>Dashboard</h2>
    <div style="background: #f8f8f8; border: 1px solid #ddd; padding: 8px; margin-bottom: 12px;">
      <strong>Apollo Debug Info:</strong><br>
      <div>HTTP Endpoint: <code>qq{{ httpEndpoint }}qq</code></div>
      <div>WS Endpoint: <code>{{ wsEndpoint }}</code></div>
     ww {{ config }}ww
     <hr/>
     {{ bob }}
    </div>
    <LogoutButton />

    <hr />
    <h2>People (Apollo Query)</h2>
    <div v-if="peopleLoading">Loading people...</div>
 
    <div v-if="entityError" style="color: red;">GraphQL Error: {{ entityError.message }}</div>
    <div v-if="entity">Entity changed: {{ entity }}</div>
    <ul v-if="people.length">
      <li v-for="person in people" :key="person.personId">
        {{ person.personId }} - {{ person.name }}
      </li>
    </ul>
    <div v-else>No people found.</div>
  </div>
</template>