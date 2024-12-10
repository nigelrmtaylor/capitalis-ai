<template>
  <v-app >
    <v-app-bar v-if="$route.path !== '/login'" color="primary">
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
    </v-app-bar>


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

    
    <slot />
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
// The footer component will be auto-imported by Nuxt
const leftDrawer: Ref<boolean> = ref(false)
  const rightDrawer: Ref<boolean> = ref(false)
</script>
