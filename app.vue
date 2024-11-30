<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="leftDrawer = !leftDrawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Capitalis AI</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="leftDrawer"
      location="left"
      temporary
    >
      <v-list>
        <v-list-item
          title="Home"
          prepend-icon="mdi-home"
          to="/"
        ></v-list-item>
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
          to="/dashboard"
        ></v-list-item>
        <v-list-item
          title="Settings"
          prepend-icon="mdi-cog"
          to="/settings"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="rightDrawer"
      location="right"
      temporary
    >
      <v-list>
        <v-list-item
          title="Profile"
          prepend-icon="mdi-account"
        ></v-list-item>
        <v-list-item
          title="Notifications"
          prepend-icon="mdi-bell"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>

    <v-footer
      app
      class="bg-grey-lighten-1"
    >
      <v-row no-gutters>
        <v-col cols="auto" class="mr-auto">
          <span class="text-caption">&copy; {{ new Date().getFullYear() }} Capitalis AI</span>
        </v-col>
        
        <v-col cols="auto" class="px-4">
          <v-icon
            :color="onlineStatus ? 'green' : 'red'"
            size="small"
            class="mr-1"
          >
            {{ onlineStatus ? 'mdi-cloud-check' : 'mdi-cloud-off-outline' }}
          </v-icon>
          <span class="text-caption">{{ onlineStatus ? 'Online' : 'Offline' }}</span>
        </v-col>

        <v-col cols="auto" class="px-4">
          <v-icon size="small" color="blue" class="mr-1">mdi-clock-outline</v-icon>
          <span class="text-caption">{{ currentTime }}</span>
        </v-col>

        <v-col cols="auto" class="px-4">
          <v-icon size="small" color="orange" class="mr-1">mdi-memory</v-icon>
          <span class="text-caption">v{{ version }}</span>
        </v-col>

        <v-col cols="auto" class="px-4">
          <v-icon size="small" color="purple" class="mr-1">mdi-monitor-screenshot</v-icon>
          <span class="text-caption">{{ currentBreakpoint }}</span>
        </v-col>

        <v-col cols="auto" class="px-4">
          <v-icon size="small" color="blue" class="mr-1">mdi-source-commit</v-icon>
          <span class="text-caption">{{ commitTime }}</span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { Ref } from 'vue'
import { useNuxtApp } from '#app'
import { useDisplay } from 'vuetify'

console.log('in app.vue');

// Add version tracking for cache debugging
const APP_VERSION = '1.0.1';
console.log('App Version:', APP_VERSION);
console.log('Commit Time:', import.meta.env.VITE_COMMIT_TIME);
console.log('Build Time:', new Date().toISOString());

const leftDrawer: Ref<boolean> = ref(false)
const rightDrawer: Ref<boolean> = ref(false)
const currentTime: Ref<string> = ref('')
const version: string = APP_VERSION
const commitTime: string = import.meta.env.VITE_COMMIT_TIME || 'Unknown'

const { $online } = useNuxtApp()
const onlineStatus = computed<boolean>(() => $online?.value ?? false)

const { name } = useDisplay()
const currentBreakpoint = computed(() => name.value.toUpperCase())

// Update time every second
const updateTime = (): void => {
  currentTime.value = new Date().toLocaleTimeString()
}

// Set up event listeners
onMounted(() => {
  updateTime()
  const timer: number = setInterval(updateTime, 1000)
  
  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>

<style scoped>
.v-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
