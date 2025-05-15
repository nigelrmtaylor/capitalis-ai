// Nuxt 3 middleware to protect all routes under /authenticated
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useHanko } from '#imports';

export default defineNuxtRouteMiddleware(() => {
  const hanko = useHanko();
  // .isValid() may be async, so we should handle both sync and async cases
  if (!hanko?.session.isValid()) {
    return navigateTo('/login');
  }
});
