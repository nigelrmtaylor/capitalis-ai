import type { Plugin } from 'vite'
import { relative } from 'path'

const normalizePathPlugin = (): Plugin => {
  return {
    name: 'normalize-paths',
    transform(code, id) {
      if (id.includes('node_modules/nuxt/dist/app/entry.js')) {
        const normalizedPath = '/_nuxt/entry.js'
        console.log(`Normalizing path: ${id} -> ${normalizedPath}`)
        return {
          code,
          map: null
        }
      }
      return null
    },
    generateBundle(options, bundle) {
      // Normalize paths in the bundle
      Object.keys(bundle).forEach(fileName => {
        const file = bundle[fileName]
        if ('modules' in file) {
          const newFileName = fileName.replace(/.*\/_nuxt\//, '_nuxt/')
          if (newFileName !== fileName) {
            bundle[newFileName] = file
            delete bundle[fileName]
          }
        }
      })
    }
  }
}

export default normalizePathPlugin
