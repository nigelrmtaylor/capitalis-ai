import { generateRegistrationOptions, generateAuthenticationOptions, verifyRegistrationResponse, verifyAuthenticationResponse } from '@simplewebauthn/server'
import type { 
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server'

// WebAuthn configuration
const rpName = 'Capitalis AI'
const rpID = process.env.WEBAUTHN_RP_ID || 'localhost'
const origin = process.env.WEBAUTHN_ORIGIN || `http://${rpID}:3000`

export const webauthnConfig = {
  rpName,
  rpID,
  origin,
  // Timeout in milliseconds
  timeout: 60000,
  // Require user verification (e.g., PIN, fingerprint)
  authenticatorSelection: {
    userVerification: 'preferred',
    residentKey: 'preferred',
    authenticatorAttachment: 'platform',
  },
  // Supported algorithms
  supportedAlgorithmIDs: [-7, -257],
} as const

export {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type GenerateAuthenticationOptionsOpts,
  type VerifyRegistrationResponseOpts,
  type VerifyAuthenticationResponseOpts,
}
