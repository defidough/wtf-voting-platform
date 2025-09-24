import type { NextApiRequest, NextApiResponse } from 'next'
import { nonceQueries, generateNonce, cleanupExpired } from '@/lib/database'
import { isValidWalletAddress, normalizeWalletAddress } from '@/lib/auth'

export interface NonceResponse {
  nonce: string
  success: boolean
}

export interface ErrorResponse {
  error: string
  success: false
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<NonceResponse | ErrorResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      success: false
    })
  }

  try {
    // Clean up expired nonces
    cleanupExpired()

    const { wallet } = req.query

    // Validate wallet address
    if (!wallet || typeof wallet !== 'string') {
      return res.status(400).json({
        error: 'Wallet address is required',
        success: false
      })
    }

    if (!isValidWalletAddress(wallet)) {
      return res.status(400).json({
        error: 'Invalid wallet address format',
        success: false
      })
    }

    const normalizedWallet = normalizeWalletAddress(wallet)

    // Generate new nonce
    const nonce = generateNonce()

    // Store nonce in database (replaces existing if any)
    nonceQueries.create.run(normalizedWallet, nonce)

    return res.status(200).json({
      nonce,
      success: true
    })

  } catch (error) {
    console.error('Nonce generation error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}