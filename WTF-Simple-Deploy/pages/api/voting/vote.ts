import type { NextApiResponse } from 'next'
import { withAuthAndMethods, AuthenticatedRequest } from '@/lib/middleware'
import { VotingService } from '@/lib/supabase'

interface VoteRequest {
  project_id: string
  votes_cast: number
}

interface VoteResponse {
  vote_id: string
  xp_earned: number
  success: boolean
}

interface ErrorResponse {
  error: string
  success: false
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<VoteResponse | ErrorResponse>
) {
  try {
    const { project_id, votes_cast }: VoteRequest = req.body
    const { wallet } = req.user

    // Validate input
    if (!project_id || !votes_cast || votes_cast <= 0) {
      return res.status(400).json({
        error: 'Invalid vote data',
        success: false
      })
    }

    // Record the vote and earn XP
    const vote = await VotingService.recordVote(wallet, project_id, votes_cast)
    const xpEarned = votes_cast * 2 // 2 XP per vote

    return res.status(200).json({
      vote_id: vote.id,
      xp_earned: xpEarned,
      success: true
    })

  } catch (error: any) {
    console.error('Vote endpoint error:', error)

    // Handle duplicate vote attempts
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({
        error: 'You have already voted for this project',
        success: false
      })
    }

    return res.status(500).json({
      error: 'Failed to record vote',
      success: false
    })
  }
}

export default withAuthAndMethods(['POST'])(handler)