
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHanko } from '#imports'

const router = useRouter()
const hanko = useHanko()
const isAuthenticated = computed(() => !!hanko?.session.get())
const leftDrawer = ref(false)
const rightDrawer = ref(false)

async function logout() {
  try {
    await hanko?.user.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}
</script>


<template>
  <v-app>
    <AppBar
      v-if="$route.path !== '/login'"
      v-model:leftDrawer="leftDrawer"
      v-model:rightDrawer="rightDrawer"
    />

    <v-navigation-drawer
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
    </v-navigation-drawer>

    <v-navigation-drawer
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
    </v-navigation-drawer>
    
    <v-main>
      <slot />
    </v-main>
    <AppFooter />
  </v-app>
</template>
