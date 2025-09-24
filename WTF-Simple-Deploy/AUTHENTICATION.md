# Secure Wallet Authentication System

This implementation provides secure wallet authentication using nonce-based signature verification and JWT sessions.

## Features Implemented

### 1. Backend API Endpoints

#### GET /api/nonce?wallet=0x...
- Returns a random nonce stored in the database
- Nonce expires in 10 minutes
- Each wallet can only have one active nonce at a time

#### POST /api/auth
- Accepts `{ wallet, signature }` payload
- Verifies signature matches the wallet and nonce
- Creates JWT session tied to the wallet
- Returns `access_token` for authenticated requests
- Sessions expire in 7 days

#### POST /api/logout
- Deactivates the current session
- Requires authentication

#### GET /api/protected/profile (example)
- Protected route that requires authentication
- Returns wallet info and token details
- Demonstrates how to use the auth middleware

### 2. Frontend Authentication Flow

#### WalletButton Component
- Shows "Connect Wallet" for disconnected users
- Shows "Sign In" for connected but unauthenticated users
- Shows authenticated state with "Sign Out" option
- Displays authentication errors

#### Authentication Hook (`useWalletAuth`)
- Handles the complete authentication flow:
  1. Request nonce from backend
  2. Create signature message
  3. Prompt wallet to sign message
  4. Send signature to backend for verification
  5. Store JWT in localStorage
- Automatically manages authentication state
- Provides logout functionality

#### Authentication Context
- Global authentication state management
- Helper hooks for checking auth status
- Seamless integration across the app

### 3. JWT Middleware

#### `withAuth` middleware
- Protects API routes
- Verifies JWT tokens
- Checks session validity in database
- Attaches user info to requests

#### `withAuthAndMethods` utility
- Combines authentication with HTTP method checking
- Simplifies protected route creation

### 4. Database Schema

#### Nonces Table
- Stores temporary nonces for signature verification
- Automatic cleanup of expired nonces

#### Sessions Table
- Stores active JWT sessions
- Enables session revocation
- Tracks session metadata

## How to Use

### For New Protected Routes

```typescript
// pages/api/protected/example.ts
import { withAuthAndMethods, AuthenticatedRequest } from '@/lib/middleware'

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { wallet } = req.user
  // Your protected logic here
}

export default withAuthAndMethods(['GET', 'POST'])(handler)
```

### For Frontend Components

```typescript
import { useAuthState, useIsAuthenticated } from '@/contexts/AuthContext'

function MyComponent() {
  const isAuthenticated = useIsAuthenticated()
  const { wallet, accessToken } = useAuthState()

  if (!isAuthenticated) {
    return <div>Please sign in</div>
  }

  return <div>Welcome {wallet}</div>
}
```

### Making Authenticated API Calls

```typescript
import { useAuthenticatedFetch } from '@/hooks/useWalletAuth'

function MyComponent() {
  const authenticatedFetch = useAuthenticatedFetch()

  const handleApiCall = async () => {
    try {
      const response = await authenticatedFetch('/api/protected/example')
      const data = await response.json()
      // Handle response
    } catch (error) {
      console.error('API call failed:', error)
    }
  }
}
```

## Security Features

### Nonce-Based Authentication
- Prevents replay attacks
- One-time use nonces
- Short expiration times

### JWT Sessions
- Cryptographically signed tokens
- Database session tracking
- Session revocation capability

### Signature Verification
- Uses ethers.js for robust signature verification
- Standardized message format
- Wallet address normalization

### Environment Configuration
- JWT_SECRET for token signing
- Configurable through .env.local
- Production security warnings

## Testing the Implementation

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **Sign In**: After connecting, click "Sign In" to authenticate
3. **Sign Message**: Approve the signature request in your wallet
4. **Authenticated State**: You'll see the authenticated UI with sign out option
5. **Test Protected Routes**: Try accessing `/api/protected/profile`

## File Structure

```
├── lib/
│   ├── auth.ts          # JWT utilities and signature verification
│   ├── database.ts      # Database schema and queries
│   └── middleware.ts    # Authentication middleware
├── hooks/
│   └── useWalletAuth.ts # Authentication hook
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── pages/api/
│   ├── nonce.ts         # Nonce generation endpoint
│   ├── auth.ts          # Authentication endpoint
│   ├── logout.ts        # Logout endpoint
│   └── protected/       # Protected routes
└── components/
    └── WalletButton.tsx # Updated with auth flow
```

The authentication system is now fully functional and ready for use with voting, proposals, and other authenticated features.