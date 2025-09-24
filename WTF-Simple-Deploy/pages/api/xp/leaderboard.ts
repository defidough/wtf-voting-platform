import type { NextApiResponse } from 'next'
import { withAuthAndMethods, AuthenticatedRequest } from '@/lib/middleware'
import { XPService } from '@/lib/supabase'
import type { LeaderboardEntry } from '@/lib/supabase-types'

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  success: boolean
}

interface ErrorResponse {
  error: string
  success: false
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<LeaderboardResponse | ErrorResponse>
) {
  try {
    const { limit = 100, offset = 0 } = req.query

    const leaderboard = await XPService.getLeaderboard(
      parseInt(limit as string),
      parseInt(offset as string)
    )

    return res.status(200).json({
      leaderboard,
      success: true
    })

  } catch (error) {
    console.error('Leaderboard endpoint error:', error)
    return res.status(500).json({
      error: 'Failed to fetch leaderboard',
      success: false
    })
  }
}

export default withAuthAndMethods(['GET'], { requireAuth: false })(handler)