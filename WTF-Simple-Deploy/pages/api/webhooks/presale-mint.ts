import type { NextApiRequest, NextApiResponse } from 'next'
import { MintTracker } from '@/lib/mint-tracker'
import { monitoring } from '@/lib/monitoring'
import crypto from 'crypto'

interface WebhookMintRequest {
  wallet: string
  nfts: number
  tx_hash: string
  project_id: string
  contract_address?: string
  block_number?: number
  timestamp?: number
}

interface WebhookResponse {
  success: boolean
  message: string
  data?: {
    wallet: string
    nfts: number
    xp_earned: number
    tx_hash: string
  }
}

interface ErrorResponse {
  success: false
  error: string
  code?: string
}

// Webhook signature verification
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // Handle both 'sha256=' prefixed and raw signatures
    const receivedSignature = signature.startsWith('sha256=')
      ? signature.slice(7)
      : signature

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    )
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // requests per window
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_WINDOW

  const record = rateLimitMap.get(identifier)
  if (!record || record.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse | ErrorResponse>
) {
  monitoring.recordWebhookRequest()

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for'] as string ||
                    req.headers['x-real-ip'] as string ||
                    req.connection.remoteAddress ||
                    'unknown'

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMITED'
      })
    }

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.PRESALE_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = req.headers['x-signature'] as string ||
                       req.headers['x-hub-signature-256'] as string

      if (!signature) {
        return res.status(401).json({
          success: false,
          error: 'Missing webhook signature',
          code: 'MISSING_SIGNATURE'
        })
      }

      const rawBody = JSON.stringify(req.body)
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        return res.status(401).json({
          success: false,
          error: 'Invalid webhook signature',
          code: 'INVALID_SIGNATURE'
        })
      }
    }

    // Parse and validate request body
    const mintData: WebhookMintRequest = req.body

    // Validate required fields
    if (!mintData.wallet || !mintData.nfts || !mintData.tx_hash || !mintData.project_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: wallet, nfts, tx_hash, project_id',
        code: 'MISSING_FIELDS'
      })
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(mintData.wallet)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format',
        code: 'INVALID_WALLET'
      })
    }

    // Validate transaction hash format
    if (!/^0x[a-fA-F0-9]{64}$/.test(mintData.tx_hash)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction hash format',
        code: 'INVALID_TX_HASH'
      })
    }

    // Validate NFT count
    if (mintData.nfts <= 0 || mintData.nfts > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid NFT count (must be between 1 and 10000)',
        code: 'INVALID_NFT_COUNT'
      })
    }

    // Process the mint event
    const tracker = MintTracker.getInstance()
    const result = await tracker.processWebhookMint(mintData)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.message,
        code: 'PROCESSING_FAILED'
      })
    }

    // Return success response
    const xpEarned = mintData.nfts * 5 // 5 XP per NFT

    monitoring.addAlert('info', 'Webhook mint processed successfully', {
      wallet: mintData.wallet,
      nfts: mintData.nfts,
      xpEarned,
      txHash: mintData.tx_hash
    })

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        wallet: mintData.wallet,
        nfts: mintData.nfts,
        xp_earned: xpEarned,
        tx_hash: mintData.tx_hash
      }
    })

  } catch (error: any) {
    console.error('Webhook processing error:', error)

    // Handle known error types
    if (error.message?.includes('duplicate')) {
      return res.status(409).json({
        success: false,
        error: 'Transaction already processed',
        code: 'DUPLICATE_TRANSACTION'
      })
    }

    if (error.message?.includes('verification')) {
      return res.status(400).json({
        success: false,
        error: 'Transaction verification failed',
        code: 'VERIFICATION_FAILED'
      })
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
}

// Export configuration for larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}