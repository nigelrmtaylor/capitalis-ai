<script setup lang="ts">
// Component logic here
</script>


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
            <div class="mt-6">
              <h3 class="text-h6 mb-4">Client-side Notifications</h3>
              <NotificationTest />
            </div>
            <v-divider class="my-4"></v-divider>
            <div class="mt-4">
              <h3 class="text-h6 mb-4">Server-side Notifications</h3>
              <ServerNotificationTest />
            </div>
            <v-divider class="my-4"></v-divider>
            <div class="mt-4">
              <h3 class="text-h6 mb-4">Notification Examples</h3>
              <NotificationExamples />
            </div>
            <div class="container mx-auto px-4 py-8">
              <OneSignalTest />
            </div>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn color="primary" size="large" class="mx-2">
              Get Started
            </v-btn>
            <v-btn color="secondary" to="/login" class="mx-2">
              Login
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
