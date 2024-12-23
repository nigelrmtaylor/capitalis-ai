<script setup lang="ts">
definePageMeta({
  middleware: ["hanko-logged-in"],
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" lg="6">
        <v-card class="mb-4">
          <v-card-title class="text-h5">Hanko Profile</v-card-title>
          <v-card-text>
            <hanko-profile />
          </v-card-text>
        </v-card>

        <ProfileNameEdit />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(hanko-profile) {
  --color-primary: rgb(var(--v-theme-primary));
  --color-bg-1: rgb(var(--v-theme-surface));
  --color-bg-2: rgb(var(--v-theme-surface-variant));
  --color-error: rgb(var(--v-theme-error));
  --color-success: rgb(var(--v-theme-success));
  --border-radius: 4px;
  margin-bottom: 1rem;
}
</style>