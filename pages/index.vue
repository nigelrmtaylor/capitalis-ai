<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mt-5">
          <v-card-title class="text-h4 text-center">
            Welcome to Capitalis AI - v2
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-body-1 mt-4">
              Your powerful AI-driven application (Updated Dec 8)
            </p>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn color="primary" size="large" class="mx-2">
              Get Started
            </v-btn>
            <NuxtLink to="/login">
                 
                  Login
              
            </NuxtLink>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
/* Component styles here */
</style>
