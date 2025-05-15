import { ref } from 'vue'

interface PasskeyCredential {
  id: string
  rawId: ArrayBuffer
  response: {
    clientDataJSON: ArrayBuffer
    attestationObject?: ArrayBuffer
    authenticatorData?: ArrayBuffer
    signature?: ArrayBuffer
    userHandle?: ArrayBuffer
  }
  type: 'public-key'
  authenticatorAttachment?: string
}

/**
 * Nuxt Plugin for Passkey Authentication
 * 
 * This plugin provides passkey (WebAuthn) functionality for authentication.
 * It handles registration and authentication of passkeys using the WebAuthn API.
 */
export default defineNuxtPlugin(() => {
  const isAuthenticated = ref(false)
  const username = ref('')

  // Check if WebAuthn is supported
  const isSupported = typeof window !== 'undefined' && 
                     window.PublicKeyCredential !== undefined &&
                     typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'

  // Convert ArrayBuffer to Base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let string = ''
    for (const byte of bytes) {
      string += String.fromCharCode(byte)
    }
    return btoa(string)
  }

  // Convert Base64 string to ArrayBuffer
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  /**
   * Register a new passkey
   * @param username The username to register
   * @returns Promise resolving to the credential response
   */
  const register = async (newUsername: string): Promise<any> => {
    try {
      if (!isSupported) {
        throw new Error('WebAuthn is not supported in this browser')
      }

      // Get registration options from server
      const optionsResponse = await fetch('/api/auth/register/options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      })
      
      if (!optionsResponse.ok) {
        throw new Error('Failed to get registration options')
      }

      const options = await optionsResponse.json()

      // Prepare options for navigator.credentials.create
      const publicKeyOptions = {
        ...options,
        challenge: base64ToArrayBuffer(options.challenge),
        user: {
          ...options.user,
          id: Uint8Array.from((options.user.id as string), c => c.charCodeAt(0)),
        },
      }

      // Create credentials
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      }) as PasskeyCredential

      if (!credential) {
        throw new Error('Failed to create credential')
      }

      // Prepare credential data for server
      const credentialResponse = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        response: {
          clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
          attestationObject: arrayBufferToBase64(credential.response.attestationObject!),
        },
        type: credential.type,
      }

      // Send credential to server
      const verifyResponse = await fetch('/api/auth/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername,
          credential: credentialResponse,
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify registration')
      }

      username.value = newUsername
      isAuthenticated.value = true
      return await verifyResponse.json()
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Authenticate with a passkey
   * @param loginUsername The username to authenticate
   * @returns Promise resolving to the authentication response
   */
  const authenticate = async (loginUsername: string): Promise<any> => {
    try {
      if (!isSupported) {
        throw new Error('WebAuthn is not supported in this browser')
      }

      // Get authentication options from server
      const optionsResponse = await fetch('/api/auth/login/options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginUsername }),
      })

      if (!optionsResponse.ok) {
        throw new Error('Failed to get authentication options')
      }

      const options = await optionsResponse.json()

      // Prepare options for navigator.credentials.get
      const publicKeyOptions = {
        ...options,
        challenge: base64ToArrayBuffer(options.challenge),
        allowCredentials: options.allowCredentials.map((credential: any) => ({
          ...credential,
          id: base64ToArrayBuffer(credential.id),
        })),
      }

      // Get credentials
      const credential = await navigator.credentials.get({
        publicKey: publicKeyOptions,
      }) as PasskeyCredential

      if (!credential) {
        throw new Error('Failed to get credential')
      }

      // Prepare credential data for server
      const credentialResponse = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        response: {
          clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
          authenticatorData: arrayBufferToBase64(credential.response.authenticatorData!),
          signature: arrayBufferToBase64(credential.response.signature!),
          userHandle: credential.response.userHandle ? arrayBufferToBase64(credential.response.userHandle) : null,
        },
        type: credential.type,
      }

      // Send credential to server
      const verifyResponse = await fetch('/api/auth/login/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,
          credential: credentialResponse,
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify authentication')
      }

      username.value = loginUsername
      isAuthenticated.value = true
      return await verifyResponse.json()
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    }
  }

  /**
   * Log out the current user
   */
  const logout = () => {
    username.value = ''
    isAuthenticated.value = false
  }

  // Provide passkey functionality to the application
  return {
    provide: {
      passkey: {
        isSupported,
        isAuthenticated,
        username,
        register,
        authenticate,
        logout,
      }
    }
  }
})
