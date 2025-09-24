import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyJWT, hashToken, JWTPayload } from './auth'
import { sessionQueries } from './database'

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    wallet: string
    tokenPayload: JWTPayload
  }
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean
}

type AuthorizedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void

export function withAuth(
  handler: AuthorizedHandler,
  options: AuthMiddlewareOptions = { requireAuth: true }
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization
      let token: string | null = null

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }

      // If auth is required and no token provided
      if (options.requireAuth && !token) {
        return res.status(401).json({
          error: 'Access token required',
          success: false
        })
      }

      // If token provided, verify it
      if (token) {
        // Verify JWT signature and expiration
        const payload = await verifyJWT(token)

        if (!payload) {
          return res.status(401).json({
            error: 'Invalid or expired token',
            success: false
          })
        }

        // Check if token exists in database session store
        const tokenHash = hashToken(token)
        const session = sessionQueries.get.get(tokenHash) as any

        if (!session) {
          return res.status(401).json({
            error: 'Token not found or has been revoked',
            success: false
          })
        }

        // Attach user info to request
        const authenticatedReq = req as AuthenticatedRequest
        authenticatedReq.user = {
          wallet: payload.wallet,
          tokenPayload: payload
        }
      }

      // If auth is not required and no token provided, continue without user
      if (!options.requireAuth && !token) {
        const authenticatedReq = req as AuthenticatedRequest
        // Don't set user property if not authenticated
      }

      // Call the actual handler
      return await handler(req as AuthenticatedRequest, res)

    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({
        error: 'Internal server error',
        success: false
      })
    }
  }
}

// Utility function to check if request is authenticated
export function isAuthenticated(req: AuthenticatedRequest): boolean {
  return !!req.user
}

// Utility function to get authenticated wallet address
export function getAuthenticatedWallet(req: AuthenticatedRequest): string | null {
  return req.user?.wallet || null
}

// Helper for methods that should only work with specific HTTP methods
export function withMethods(methods: string[]) {
  return (handler: AuthorizedHandler) => {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!methods.includes(req.method || '')) {
        return res.status(405).json({
          error: `Method ${req.method} not allowed`,
          success: false
        })
      }
      return handler(req, res)
    }
  }
}

// Combine auth and method checking
export function withAuthAndMethods(
  methods: string[],
  options: AuthMiddlewareOptions = { requireAuth: true }
) {
  return (handler: AuthorizedHandler) => {
    return withAuth(
      withMethods(methods)(handler),
      options
    )
  }
}