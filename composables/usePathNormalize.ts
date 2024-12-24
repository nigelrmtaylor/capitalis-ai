// composables/usePathNormalize.ts

export function usePathNormalize() {
  const normalizePath = (path: string) => {
    if (path.includes('node_modules/nuxt/dist/app/entry.js')) {
      return '/_nuxt/entry.js'
    }
    return path.replace(/.*\/_nuxt\//, '_nuxt/')
  }

  return {
    normalizePath
  }
}
