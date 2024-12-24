import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { md3 } from 'vuetify/blueprints'
import 'vuetify/styles'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    blueprint: md3,
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#0D47A1', // blue-darken-4
            secondary: '#E91E63', // pink
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#0D47A1', // blue-darken-4
            secondary: '#E91E63', // pink
            accent: '#FF4081',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
          },
        },
      },
    },
  })

  app.vueApp.use(vuetify)
})
