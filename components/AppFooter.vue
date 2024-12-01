<template>
  <v-footer app class="text-caption">
    <v-row justify="center" no-gutters>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>Capitalis AI</strong>
        <span v-if="commitHash" class="ml-2 text-disabled">Build: {{ commitHash.substring(0, 7) }}</span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
const commitHash = import.meta.env.VITE_GIT_COMMIT || '';
</script>
