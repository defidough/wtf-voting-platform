import type { NextApiRequest, NextApiResponse } from 'next'
import { nonceQueries, sessionQueries, usedNonceQueries, cleanupExpired } from '@/lib/database'
import {
  signJWT,
  verifySignature,
  createSignatureMessage,
  hashToken,
  isValidWalletAddress,
  normalizeWalletAddress
} from '@/lib/auth'

export interface AuthRequest {
  wallet: string
  signature: string
}

export interface AuthResponse {
  access_token: string
  wallet: string
  success: boolean
}

export interface ErrorResponse {
  error: string
  success: false
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse | ErrorResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      success: false
    })
  }

  try {
    // Clean up expired records
    cleanupExpired()

    const { wallet, signature }: AuthRequest = req.body

    // Validate input
    if (!wallet || !signature) {
      return res.status(400).json({
        error: 'Wallet address and signature are required',
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

    // Get nonce from database
    const nonceRecord = nonceQueries.get.get(normalizedWallet) as any

    if (!nonceRecord) {
      return res.status(400).json({
        error: 'Invalid or expired nonce. Please request a new nonce.',
        success: false
      })
    }

    // Check if nonce has already been used (prevents replay attacks)
    const usedNonceCheck = usedNonceQueries.check.get(nonceRecord.nonce) as any
    if (usedNonceCheck && usedNonceCheck.count > 0) {
      return res.status(400).json({
        error: 'Nonce has already been used. Please request a new nonce.',
        success: false
      })
    }

    // Create signature message
    const message = createSignatureMessage(nonceRecord.nonce, normalizedWallet)

    // Verify signature (now async for smart wallet support)
    const isValidSignature = await verifySignature(message, signature, normalizedWallet)

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Invalid signature',
        success: false
      })
    }

    // Mark nonce as used to prevent replay attacks
    usedNonceQueries.create.run(nonceRecord.nonce, normalizedWallet)

    // Delete used nonce from active nonces
    nonceQueries.delete.run(normalizedWallet)

    // Deactivate existing sessions for this wallet
    sessionQueries.deactivate.run(normalizedWallet)

    // Generate JWT token
    const token = await signJWT({ wallet: normalizedWallet })
    const tokenHash = hashToken(token)

    // Store session in database
    sessionQueries.create.run(normalizedWallet, tokenHash)

    return res.status(200).json({
      access_token: token,
      wallet: normalizedWallet,
      success: true
    })

  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}