<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const { result, loading, error } = useQuery(gql`
  query {
    __typename
  }
`)
</script>

<template>
  <div style="padding: 2rem;">
    <h1>Apollo Test Page</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>Result: <pre>{{ result }}</pre></div>
  </div>
</template>
