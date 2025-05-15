<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHanko } from '#imports'
import { useTheme } from 'vuetify'
import { useSubscriptionIndicator } from '~/composables/useSubscriptionIndicator'

// Setup for indicator
const { indicatorColor } = useSubscriptionIndicator()

interface HankoSessionWithJwt {
  user_id: string
  created_at: string
  expires_at: string
  jwt?: string
}

const router = useRouter()
const hanko = useHanko()
const theme = useTheme()
const leftDrawer = defineModel('left-drawer', { type: Boolean })
const rightDrawer = defineModel('right-drawer', { type: Boolean })
const menu = ref(false)
const themeMenu = ref(false)
const showCopiedIcon = ref(false)
const showCopiedAuthIcon = ref(false)
const showSnackbar = ref(false)
const showJwtDetails = ref(false)
const decodedJwt = ref<any>(null)
const jwtDebug = ref<string>("")
const jwtError = ref<string>("")

// These would typically come from your user store or auth service
const userImage = ref<string | null>(null)
const userName = ref<string>('')
const userEmail = ref<string>('')

// Get user email and name from Hanko
onMounted(async () => {
  console.log('APPBAR MOUNTED')
  try {
    const user = await hanko?.user.getCurrent()
    console.log('APPBAR 1')
    if (user) {
      // Get email from user object
      if (user.email) {
        userEmail.value = user.email
      }

      // Get name from custom data
      const session = hanko?.session as HankoSessionWithJwt | undefined
      console.log('Hanko Session:', session)
      jwtDebug.value = JSON.stringify(session, null, 2)
      if (!session?.jwt) {
        jwtError.value = 'No JWT found in Hanko session.'
        console.warn('No JWT found in Hanko session:', session)
      } else {
        jwtError.value = ''
      }
      try {
        const response = await fetch(`${hanko?.api}/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${session?.jwt}`
          }
        })
        const userData = await response.json()
        console.log('User Data:', userData);

        if (userData.customData?.name) {
          userName.value = userData.customData.name
        } else {
          // Fallback to email prefix if no name is set
          userName.value = userEmail.value.split('@')[0]
        }
      } catch (apiError) {
        jwtError.value = 'Failed to fetch user data with JWT.'
        console.error('Error fetching user data with JWT:', apiError)
      }
    }
  } catch (error) {
    jwtError.value = 'Error getting user details or session.'
    console.error('Error getting user details:', error)
  }
})

const copyJwtToken = async () => {
  try {
    const session = hanko?.session as HankoSessionWithJwt | undefined
    console.log('Hanko Session:', session)
    
    if (session?.jwt) {
      await navigator.clipboard.writeText(session.jwt)
      showCopiedIcon.value = true
      showSnackbar.value = true
      setTimeout(() => {
        showCopiedIcon.value = false
      }, 2000)
    } else {
      console.error('No JWT found in session:', session)
    }
  } catch (error) {
    console.error('Error copying JWT token:', error)
  }
}

const copyAuthHeader = async () => {
  try {
    const session = hanko?.session as HankoSessionWithJwt | undefined
    if (session?.jwt) {
      const authHeader = {
        Authorization: `Bearer ${session.jwt}`
      }
      await navigator.clipboard.writeText(JSON.stringify(authHeader, null, 2))
      showCopiedAuthIcon.value = true
    showSnackbar.value = true
      setTimeout(() => {
        showCopiedAuthIcon.value = false
      }, 2000)
    } else {
      console.error('No JWT found in session:', session)
    }
  } catch (error) {
    console.error('Error copying auth header:', error)
  }
}

// Compute user initials from name
const userInitials = computed(() => {
  if (userName.value) {
    // If we have a name, use the first letter of each word
    return userName.value
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  } else if (userEmail.value) {
    // Fallback to first two characters of email
    return userEmail.value
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase()
  }
  return '??' // Default if no name or email
})

const handleLogout = async () => {
  menu.value = false
  try {
    await hanko?.user.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Theme management
const currentTheme = ref('system')
const systemDark = ref(false)

onMounted(() => {
  if (process.client) {
    // Initialize theme from localStorage
    currentTheme.value = localStorage.getItem('theme') || 'system'
    systemDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches

    // Set up system theme change listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      systemDark.value = e.matches
      if (currentTheme.value === 'system') {
        theme.global.name.value = e.matches ? 'dark' : 'light'
      }
    })

    // Set initial theme
    setTheme(currentTheme.value as 'light' | 'dark' | 'system')
  }
})

const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
  if (!process.client) return
  
  currentTheme.value = newTheme
  localStorage.setItem('theme', newTheme)
  
  if (newTheme === 'system') {
    theme.global.name.value = systemDark.value ? 'dark' : 'light'
  } else {
    theme.global.name.value = newTheme
  }
}

const themeIcon = computed(() => {
  switch (currentTheme.value) {
    case 'light':
      return 'mdi-white-balance-sunny'
    case 'dark':
      return 'mdi-moon-waning-crescent'
    default:
      return 'mdi-monitor'
  }
})

// Watch for system theme changes when in system mode

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

watch(showJwtDetails, async (newValue) => {
  if (newValue) {
    const session = hanko?.session as HankoSessionWithJwt | undefined
    if (session?.jwt) {
      try {
        decodedJwt.value = decodeJwt(session.jwt)
        jwtError.value = ''
      } catch (e) {
        decodedJwt.value = null
        jwtError.value = 'Failed to decode JWT.'
        console.error('Failed to decode JWT:', e)
      }
    } else {
      decodedJwt.value = null
      jwtError.value = 'No JWT found in session when trying to decode.'
      console.warn('No JWT found in session when trying to decode:', session)
    }
  }
})
</script> 


<template>
  <v-app-bar
    color="primary"
    prominent
    elevation="4"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="leftDrawer = !leftDrawer"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>
      <router-link to="/" class="appbar-title-link">Capitalis</router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-menu
      v-model="themeMenu"
      :close-on-content-click="false"
      location="bottom end"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          v-bind="props"
        >
          <v-icon>{{ themeIcon }}</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          prepend-icon="mdi-white-balance-sunny"
          title="Light"
          :active="currentTheme === 'light'"
          @click="setTheme('light')"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-moon-waning-crescent"
          title="Dark"
          :active="currentTheme === 'dark'"
          @click="setTheme('dark')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-monitor"
          title="System"
          :active="currentTheme === 'system'"
          @click="setTheme('system')"
        ></v-list-item>
      </v-list>
    </v-menu>

    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
 
    <v-btn icon style="pointer-events: none;">
    
      <v-icon :color="indicatorColor === 'green' ? 'green' : 'grey'">mdi-message-processing</v-icon>
    </v-btn>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="bottom end"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="mr-2 avatar-btn"
          v-bind="props"
          variant="text"
          elevation="0"
          icon
        >
          <v-avatar
            color="secondary"
            size="36"
          >
            <v-img
              v-if="userImage"
              :src="userImage"
              alt="User Avatar"
            ></v-img>
            <span
              v-else
              class="text-body-2 text-white"
            >
              {{ userInitials }}
            </span>
          </v-avatar>
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item
            class="pa-4"
          >
            <template v-slot:prepend>
              <v-avatar
                color="secondary"
                size="48"
              >
                <v-img
                  v-if="userImage"
                  :src="userImage"
                  alt="User Avatar"
                ></v-img>
                <span
                  v-else
                  class="text-body-1 text-white"
                >
                  {{ userInitials }}
                </span>
              </v-avatar>
            </template>
            <v-list-item-title class="text-h6">{{ userName }}</v-list-item-title>
            <v-list-item-subtitle class="text-subtitle-2 mt-1">{{ userEmail }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            prepend-icon="mdi-account-outline"
            title="Profile"
            to="/profile"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-cog-outline"
            title="Settings"
            to="/settings"
          ></v-list-item>

          <v-divider></v-divider>

          <v-list-item
            prepend-icon="mdi-help-circle-outline"
            title="Help & Support"
            to="/support"
          ></v-list-item>

          <v-list-group value="auth">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-key-outline"
                title="Authentication"
              ></v-list-item>
            </template>

            <v-list-item
              prepend-icon="mdi-key-chain"
              title="Copy JWT Token"
              @click="copyJwtToken"
            >
              <template v-slot:append>
                <v-fade-transition mode="out-in">
                  <v-icon
                    :key="showCopiedIcon ? 'check' : 'copy'"
                    :color="showCopiedIcon ? 'success' : undefined"
                    :icon="showCopiedIcon ? 'mdi-check' : 'mdi-content-copy'"
                    size="small"
                  ></v-icon>
                </v-fade-transition>
              </template>
            </v-list-item>

            <v-list-item
              prepend-icon="mdi-code-json"
              title="Copy Auth Header"
              @click="copyAuthHeader"
            >
              <template v-slot:append>
                <v-fade-transition mode="out-in">
                  <v-icon
                    :key="showCopiedAuthIcon ? 'check' : 'copy'"
                    :color="showCopiedAuthIcon ? 'success' : undefined"
                    :icon="showCopiedAuthIcon ? 'mdi-check' : 'mdi-content-copy'"
                    size="small"
                  ></v-icon>
                </v-fade-transition>
              </template>
            </v-list-item>

            <v-list-item
              prepend-icon="mdi-eye-outline"
              title="View JWT Details"
              @click="showJwtDetails = true"
            ></v-list-item>
          </v-list-group>

          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <template v-slot:append>
      <v-app-bar-nav-icon @click="rightDrawer = !rightDrawer"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
  <v-snackbar
    v-model="showSnackbar"
    :timeout="2000"
    color="success"
  >
    JWT token copied to clipboard
  </v-snackbar>

  <v-dialog v-model="showJwtDetails" max-width="600">
    <v-alert v-if="jwtError" type="warning" class="mb-2">{{ jwtError }}</v-alert>
    <v-alert v-if="jwtDebug && !decodedJwt" type="info" class="mb-2">Session debug: <pre>{{ jwtDebug }}</pre></v-alert>
    <v-card>
      <v-card-title class="text-h5">
        JWT Token Details
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="showJwtDetails = false"></v-btn>
      </v-card-title>
      <v-card-text v-if="decodedJwt" class="pa-4">
        <v-list>
          <v-list-subheader>Audience</v-list-subheader>
          <v-list-item v-for="aud in decodedJwt.aud" :key="aud">
            <v-list-item-title>{{ aud }}</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2"></v-divider>
          
          <v-list-subheader>Email</v-list-subheader>
          <v-list-item>
            <v-list-item-title>{{ decodedJwt.email.address }}</v-list-item-title>
            <template v-slot:append>
              <v-chip
                :color="decodedJwt.email.is_verified ? 'success' : 'warning'"
                size="small"
              >
                {{ decodedJwt.email.is_verified ? 'Verified' : 'Unverified' }}
              </v-chip>
            </template>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-subheader>Timing</v-list-subheader>
          <v-list-item>
            <v-list-item-title>Issued At</v-list-item-title>
            <v-list-item-subtitle>{{ new Date(decodedJwt.iat * 1000).toLocaleString() }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Expires At</v-list-item-title>
            <v-list-item-subtitle>{{ new Date(decodedJwt.exp * 1000).toLocaleString() }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-subheader>Subject (User ID)</v-list-subheader>
          <v-list-item>
            <v-list-item-title>{{ decodedJwt.sub }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

