import type { NextApiRequest, NextApiResponse } from 'next'
import { LeaderboardService } from '@/lib/leaderboard-cache'
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

export default async function handler(
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
      wallet,
      refresh = 'false'
    } = req.query

    // Validate range parameter
    const validRanges: LeaderboardRange[] = ['daily', 'weekly', 'monthly', 'all']
    const leaderboardRange = validRanges.includes(range as LeaderboardRange)
      ? (range as LeaderboardRange)
      : 'all'

    // Parse limit
    const limitNum = Math.min(Math.max(parseInt(limit as string) || 100, 1), 1000)

    // Force refresh if requested
    const forceRefresh = refresh === 'true'

    // Get leaderboard data
    const leaderboard = await LeaderboardService.getLeaderboard(
      leaderboardRange,
      limitNum,
      forceRefresh
    )

    // Get user rank if wallet is provided
    let userRank: { rank: number | null; entry: LeaderboardEntry | null } | undefined

    if (wallet && typeof wallet === 'string') {
      userRank = await LeaderboardService.getUserRank(wallet, leaderboardRange)
    }

    // Check if data was served from cache
    const cacheStats = LeaderboardService.getCacheStats()
    const cached = !forceRefresh && !!cacheStats[leaderboardRange]

    return res.status(200).json({
      success: true,
      data: {
        leaderboard,
        range: leaderboardRange,
        total: leaderboard.length,
        cached,
        lastUpdated: Date.now(),
        userRank
      }
    })

  } catch (error: any) {
    console.error('Leaderboard API error:', error)

    // Return appropriate error message
    let errorMessage = 'Internal server error'
    if (error.message?.includes('Invalid supabaseUrl')) {
      errorMessage = 'Database not configured'
    } else if (error.message?.includes('connect')) {
      errorMessage = 'Database connection failed'
    }

    return res.status(500).json({
      success: false,
      error: errorMessage
    })
  }
}

// API route configuration
export const config = {
  api: {
    responseLimit: '8mb', // Allow larger responses for leaderboards
  },
}