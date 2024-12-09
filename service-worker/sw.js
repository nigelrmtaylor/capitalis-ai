import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst } from 'workbox-strategies'

// Normalize URLs by removing absolute paths
const normalizeUrl = (url) => {
  const nuxtMatch = url.match(/\/_nuxt\/.*$/)
  if (nuxtMatch) {
    return nuxtMatch[0]
  }
  return url
}

// Get the precache manifest and normalize URLs
const manifestEntries = self.__WB_MANIFEST.map(entry => {
  if (typeof entry === 'string') {
    return normalizeUrl(entry)
  }
  return {
    ...entry,
    url: normalizeUrl(entry.url)
  }
})

// Precache normalized URLs
precacheAndRoute(manifestEntries)

// Handle navigation requests
const handler = createHandlerBoundToURL('/')
registerRoute(new NavigationRoute(handler))

// Handle Nuxt assets
registerRoute(
  ({ request, url }) => {
    // Normalize the URL before matching
    const normalizedPath = normalizeUrl(url.pathname)
    return normalizedPath.startsWith('/_nuxt/') &&
           (request.destination === 'script' || 
            request.destination === 'style')
  },
  new NetworkFirst({
    cacheName: 'nuxt-assets'
  })
)

// Handle static assets
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images'
  })
)
