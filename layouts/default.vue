
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHanko } from '#imports'

const router = useRouter()
const hanko = useHanko()
const isAuthenticated = computed(() => !!hanko?.session.isValid())
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
    <ClientOnly>
      <AppBar
        v-if="$route.path !== '/login'"
        v-model:left-drawer="leftDrawer"
        v-model:right-drawer="rightDrawer"
      />
    </ClientOnly>

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
          to="/authenticated/dashboard"
        ></v-list-item>

        <v-list-item
          title="Settingsqqq"
          prepend-icon="mdi-cog"
          to="/authenticated/settings"
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
          to="/profile"
        ></v-list-item>
        <v-list-item
          title="Notifications"
          prepend-icon="mdi-bell"
          to="/notifications"
        ></v-list-item>
        <v-list-item
          title="Account Settings"
          prepend-icon="mdi-cog"
          to="/authenticated/settings"
        ></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          title="Help & Support"
          prepend-icon="mdi-help-circle"
          to="/support"
        ></v-list-item>
        <v-list-item
          title="Logout"
          prepend-icon="mdi-logout"
          @click="logout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main>
      <slot />
    </v-main>
    <ClientOnly>
    qqqq  <AppFooter v-if="$route.path !== '/login'" />qqq
    </ClientOnly>
  </v-app>
</template>
