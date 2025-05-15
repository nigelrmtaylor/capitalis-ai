<script setup lang="ts">
import { ref, computed } from 'vue'

const hasPermission = ref(false)



</script>


<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mt-5">
          <v-card-title class="text-h4 text-center">
            Welcome to Capitalis
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-body-1 mt-4">
              For controlling your finances
            </p>
            <v-divider class="my-4"></v-divider>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn color="primary" size="large" class="mx-2">
              Get Started
            </v-btn>
            <v-btn color="secondary" to="/login" class="mx-2">
              Login
            </v-btn>
            <v-btn color="secondary" to="/profile" class="mx-2">
              Profile
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>
/* Component styles here */
</style>
