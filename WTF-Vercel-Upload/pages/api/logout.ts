import type { NextApiResponse } from 'next'
import { withAuthAndMethods, AuthenticatedRequest } from '@/lib/middleware'
import { sessionQueries, hashToken } from '@/lib/database'

interface LogoutResponse {
  message: string
  success: boolean
}

interface ErrorResponse {
  error: string
  success: false
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<LogoutResponse | ErrorResponse>
) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const tokenHash = hashToken(token)

      // Deactivate the session in database
      sessionQueries.deactivate.run(req.user.wallet)
    }

    return res.status(200).json({
      message: 'Successfully logged out',
      success: true
    })

  } catch (error) {
    console.error('Logout endpoint error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

export default withAuthAndMethods(['POST'])(handler)