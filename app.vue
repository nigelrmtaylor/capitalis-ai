<template>
  <div>
    <Head>
      <link rel="icon" type="image/svg+xml" href="/icon-source.svg" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="apple-touch-icon" href="/icon-source.svg" />
      <meta name="apple-mobile-web-app-title" content="Capitalis" />
    </Head>
    <NuxtLayout>
      <!-- <v-app-bar v-if="$route.path !== '/login'" color="primary">
        <v-app-bar-nav-icon @click="leftDrawer = !leftDrawer"></v-app-bar-nav-icon>
        <v-app-bar-title>Capitalis AI</v-app-bar-title>
        <v-spacer></v-spacer>
        <ClientOnly>
          <v-btn v-if="isAuthenticated" @click="logout" prepend-icon="mdi-logout">
            Logout
          </v-btn>
        </ClientOnly>
        <v-btn icon @click="rightDrawer = !rightDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-app-bar> -->

      <!-- <v-navigation-drawer
        v-if="$route.path !== '/login'"
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
      </v-navigation-drawer> -->

      <!-- <v-navigation-drawer
        v-if="$route.path !== '/login'"
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
      </v-navigation-drawer> -->

      <v-main>
        <v-container>
          <NuxtPage />
        </v-container>
      </v-main>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// import { ref, onMounted, onUnmounted, computed } from 'vue'
// import type { Ref } from 'vue'
// import { useNuxtApp } from '#app'
// import { useDisplay } from 'vuetify'
// import { useHanko } from '#imports'

// console.log('in app.vue...');

// Add version tracking for cache debugging
// const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'unknown';
// console.log('App Version:', APP_VERSION);
// console.log('Commit Time:', import.meta.env.VITE_COMMIT_TIME);
// console.log('Build Time:', new Date().toISOString());


// const currentTime: Ref<string> = ref('')
// const version: string = APP_VERSION.replace(/^v/, '')
// const commitTime: string = import.meta.env.VITE_COMMIT_TIME ? 
//   new Date(import.meta.env.VITE_COMMIT_TIME).toLocaleString([], { 
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit'
//   }) : 
//   'Unknown'

// Access the online status from our plugin
// This $online ref is provided by plugins/online-status.client.ts
// const { $online } = useNuxtApp()
// // Create a computed property to safely handle the online status
// // with a fallback to false if $online is undefined
// const onlineStatus = computed<boolean>(() => {
//   const status = $online?.value ?? false
//   console.log('Online status computed:', status, '$online value:', $online?.value)
//   return status
// })

// const { name } = useDisplay()
// const currentBreakpoint = computed(() => name.value.toUpperCase())



// // Initialize authentication on app mount
// onMounted(() => {

//   updateTime()
//   const timer: ReturnType<typeof setInterval> = setInterval(updateTime, 1000)
  
//   onUnmounted(() => {
//     clearInterval(timer)
//   })
// })

// // Update time every second
// const updateTime = (): void => {
//   currentTime.value = new Date().toLocaleTimeString()
// }
</script>

<!-- <style scoped>
.v-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style> -->
