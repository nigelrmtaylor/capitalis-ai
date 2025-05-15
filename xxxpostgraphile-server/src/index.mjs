import express from 'express';
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
import { pgl } from './pgl.mjs';
import { testConnection } from './db.mjs';
import { grafserv } from "postgraphile/grafserv/express/v4";

// Load environment variables
dotenv.config();

// Validate required JWT environment variables
if (!process.env.JWKS_URI) {
  console.error('\nConfiguration Error:');
  console.error('  Missing JWKS_URI environment variable');
  console.error('  Please set JWKS_URI in your .env file');
  process.exit(1);
}

if (!process.env.JWT_AUDIENCE) {
  console.error('\nConfiguration Error:');
  console.error('  Missing JWT_AUDIENCE environment variable');
  console.error('  Please set JWT_AUDIENCE in your .env file');
  process.exit(1);
}

// if (!process.env.JWT_ISSUER) {
//   console.error("\nConfiguration Error:");
//   console.error("  Missing JWT_ISSUER environment variable");
//   console.error("  Please set JWT_ISSUER in your .env file");
//   process.exit(1);
// }



// Create our PostGraphile grafserv instance, `serv`:
const serv = pgl.createServ(grafserv);

const app = express();



  app.use(cookieParser());

  // Get port from environment variable or use default
  const PORT = process.env.PORT || 5678;

  console.log('Starting PostGraphile server...');
  console.log('\nServer Configuration:');
  console.log(`  Port: ${PORT}`);

  console.log('\nJWT Configuration:');
  console.log(`  JWKS URI: ${process.env.JWKS_URI}`);
  console.log(`  Audience: ${process.env.JWT_AUDIENCE}`);
  console.log(`  Issuer: ${process.env.JWT_ISSUER}`);

  // Test database connection before proceeding
  try {
    await testConnection();
  } catch (error) {
    process.exit(1);
  }


  // JWT validation middleware
  const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.JWKS_URI,
    }),
    audience: process.env.JWT_AUDIENCE.endsWith('/') ? process.env.JWT_AUDIENCE.slice(0, -1) : process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['RS256'],
    getToken: function fromHeaderOrCookie(req) {
      // Try Authorization header (Bearer)
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1];
      }
      // Try hanko cookie
      if (req.cookies && req.cookies.hanko) {
        return req.cookies.hanko;
      }
      return null;
    },
  });

  // JWT debug middleware

  const logJwtInfo = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const hankoCookie = req.cookies ? req.cookies.hanko : undefined;
    console.log('\nIncoming JWT Request =====================================================================');
    console.log('  Authorization Header:', authHeader ? 'Present' : 'Missing');
    console.log('  hanko Cookie:', hankoCookie ? 'Present' : 'Missing');
    if (hankoCookie) {
      try {
        const decoded = jwtDecode(hankoCookie);
        console.log('  Decoded hanko cookie JWT subject (sub):', decoded.sub);
      } catch (e) {
        console.log('  Failed to decode hanko cookie JWT:', e.message);
      }
    }

    if (req.auth) {
      console.log('  Decoded JWT Payload:');
      console.log('    Subject:', req.auth.sub);
      console.log('    Issuer:', req.auth.iss);
      console.log('    Audience:', req.auth.aud);
      console.log('    Issued At:', new Date(req.auth.iat * 1000).toISOString());

      if (req.auth.exp) {
        const expirationDate = new Date(req.auth.exp * 1000);
        const now = new Date();
        const timeRemaining = expirationDate - now;
        const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        console.log('    Expires At:', expirationDate.toISOString());
        console.log('    Time Remaining:', `${daysRemaining} days, ${hoursRemaining} hours`);

        // Warn if token is close to expiration (less than 7 days)
        if (timeRemaining < 7 * 24 * 60 * 60 * 1000) {
          console.log('    ⚠️  WARNING: Token will expire in less than 7 days');
        }
      } else {
        console.log('    Expires At: No expiration');
      }

      if (req.auth.scope) {
        console.log('    Scopes:', req.auth.scope);
      }

      // Log any custom claims
      const standardClaims = ['sub', 'iss', 'aud', 'iat', 'exp', 'scope'];
      const customClaims = Object.keys(req.auth)
        .filter((key) => !standardClaims.includes(key));

      if (customClaims.length > 0) {
        console.log('    Custom Claims:');
        customClaims.forEach((claim) => {
          console.log(`      ${claim}:`, req.auth[claim]);
        });
      }
    }
    next();
  };

  // Minimal JWT decode utility if jwt-decode is not available
  function jwtDecode(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error('Invalid JWT');
    }
  }

  // Error handling for auth errors
  const handleAuthError = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      console.error('\nJWT Validation Error:');
      console.error('  Error Name:', err.name);
      console.error('  Error Message:', err.message);
      console.error('  Error Code:', err.status);
      console.error('  Error Inner:', err.inner ? err.inner.message : 'No inner error');

      res.status(err.status).json({
        errors: [{
          message: 'Invalid token or missing authentication',
          details: err.message,
        }],
      });
      return;
    }
    next(err);
  };

  // Add Express middleware
  app.use(express.json());

  // Apply JWT middleware to /graphql endpoint
  app.post('/graphql', logJwtInfo, checkJwt, handleAuthError);

  const server = createServer(app);

serv.addTo(app, server).catch((e) => {
  console.error(e);
  process.exit(1);
});

  app.listen(PORT, () => {
    console.info(`[Server] Listening at http://localhost:${PORT}`);
    console.info(`[Server] GraphiQL available at http://localhost:${PORT}/graphiql`);
    console.info(`[Server] -------------------------------------------------------`);
  });
