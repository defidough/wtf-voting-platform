import type { NextApiResponse } from 'next'
import { withAuthAndMethods, AuthenticatedRequest } from '@/lib/middleware'

interface ProfileResponse {
  wallet: string
  authenticated: boolean
  tokenInfo: {
    issuedAt: number
    expiresAt: number
  }
  success: boolean
}

interface ErrorResponse {
  error: string
  success: false
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ProfileResponse | ErrorResponse>
) {
  try {
    const { wallet, tokenPayload } = req.user

    return res.status(200).json({
      wallet,
      authenticated: true,
      tokenInfo: {
        issuedAt: tokenPayload.iat,
        expiresAt: tokenPayload.exp
      },
      success: true
    })

  } catch (error) {
    console.error('Profile endpoint error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

export default withAuthAndMethods(['GET'])(handler)