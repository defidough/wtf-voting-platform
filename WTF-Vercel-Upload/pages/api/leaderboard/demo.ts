import type { NextApiRequest, NextApiResponse } from 'next'
import type { LeaderboardEntry, LeaderboardRange } from '@/lib/leaderboard-cache'

interface LeaderboardResponse {
  success: boolean
  data?: {
    leaderboard: LeaderboardEntry[]
    range: LeaderboardRange
    total: number
    cached: boolean
    lastUpdated: number
    userRank?: {
      rank: number | null
      entry: LeaderboardEntry | null
    }
  }
  error?: string
}

// Generate demo leaderboard data
function generateDemoLeaderboard(range: LeaderboardRange, limit: number): LeaderboardEntry[] {
  const demoWallets = [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012',
    '0x4567890123456789012345678901234567890123',
    '0x5678901234567890123456789012345678901234',
    '0x6789012345678901234567890123456789012345',
    '0x7890123456789012345678901234567890123456',
    '0x8901234567890123456789012345678901234567',
    '0x9012345678901234567890123456789012345678',
    '0xa123456789012345678901234567890123456789',
    '0xb234567890123456789012345678901234567890',
    '0xc345678901234567890123456789012345678901',
    '0xd456789012345678901234567890123456789012',
    '0xe567890123456789012345678901234567890123',
    '0xf678901234567890123456789012345678901234'
  ]

  // Multipliers based on time range
  const multipliers = {
    daily: 0.1,
    weekly: 0.4,
    monthly: 0.7,
    all: 1.0
  }

  const multiplier = multipliers[range]

  return demoWallets
    .slice(0, Math.min(limit, demoWallets.length))
    .map((wallet, index) => {
      const baseXP = (15 - index) * 1000 * multiplier
      const vote_xp = Math.floor(baseXP * 0.4 + Math.random() * 500)
      const presale_xp = Math.floor(baseXP * 0.35 + Math.random() * 400)
      const builder_xp = Math.floor(baseXP * 0.25 + Math.random() * 300)
      const total_xp = vote_xp + presale_xp + builder_xp

      return {
        wallet,
        vote_xp,
        presale_xp,
        builder_xp,
        total_xp,
        rank: index + 1,
        last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
    .sort((a, b) => b.total_xp - a.total_xp)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const {
      range = 'all',
      limit = '100',
      wallet
    } = req.query

    // Validate range parameter
    const validRanges: LeaderboardRange[] = ['daily', 'weekly', 'monthly', 'all']
    const leaderboardRange = validRanges.includes(range as LeaderboardRange)
      ? (range as LeaderboardRange)
      : 'all'

    // Parse limit
    const limitNum = Math.min(Math.max(parseInt(limit as string) || 100, 1), 1000)

    // Generate demo data
    const leaderboard = generateDemoLeaderboard(leaderboardRange, limitNum)

    // Find user rank if wallet is provided
    let userRank: { rank: number | null; entry: LeaderboardEntry | null } | undefined

    if (wallet && typeof wallet === 'string') {
      const userEntry = leaderboard.find(entry =>
        entry.wallet.toLowerCase() === wallet.toLowerCase()
      )
      userRank = {
        rank: userEntry?.rank || null,
        entry: userEntry || null
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        leaderboard,
        range: leaderboardRange,
        total: leaderboard.length,
        cached: false,
        lastUpdated: Date.now(),
        userRank
      }
    })

  } catch (error: any) {
    console.error('Demo leaderboard API error:', error)

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}