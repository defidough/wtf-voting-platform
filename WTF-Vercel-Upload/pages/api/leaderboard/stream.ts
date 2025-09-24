import type { NextApiRequest, NextApiResponse } from 'next'
import { LeaderboardService } from '@/lib/leaderboard-cache'
import type { LeaderboardRange } from '@/lib/leaderboard-cache'

// Store active connections
const connections = new Map<string, {
  res: NextApiResponse
  range: LeaderboardRange
  wallet?: string
  lastSent: number
}>()

// Cleanup function to remove stale connections
const cleanupConnections = () => {
  const now = Date.now()
  const staleTimeout = 5 * 60 * 1000 // 5 minutes

  for (const [id, conn] of connections.entries()) {
    if (now - conn.lastSent > staleTimeout) {
      try {
        conn.res.end()
      } catch (e) {
        // Connection already closed
      }
      connections.delete(id)
    }
  }
}

// Broadcast leaderboard updates to all connected clients
export const broadcastLeaderboardUpdate = async (range?: LeaderboardRange) => {
  if (connections.size === 0) return

  const ranges = range ? [range] : ['daily', 'weekly', 'monthly', 'all'] as LeaderboardRange[]

  for (const targetRange of ranges) {
    try {
      // Get fresh data
      const leaderboard = await LeaderboardService.getLeaderboard(targetRange, 100, true)

      // Send to all connections watching this range
      for (const [id, conn] of connections.entries()) {
        if (conn.range === targetRange) {
          try {
            // Get user rank if wallet is provided
            let userRank = undefined
            if (conn.wallet) {
              userRank = await LeaderboardService.getUserRank(conn.wallet, targetRange)
            }

            const data = {
              type: 'leaderboard_update',
              range: targetRange,
              leaderboard,
              timestamp: Date.now(),
              userRank
            }

            conn.res.write(`data: ${JSON.stringify(data)}\n\n`)
            conn.lastSent = Date.now()
          } catch (error) {
            // Connection closed, remove it
            connections.delete(id)
          }
        }
      }
    } catch (error) {
      console.error(`Error broadcasting leaderboard update for ${targetRange}:`, error)
    }
  }
}

// Periodic cleanup and heartbeat
setInterval(() => {
  cleanupConnections()

  // Send heartbeat to all connections
  for (const [id, conn] of connections.entries()) {
    try {
      conn.res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`)
      conn.lastSent = Date.now()
    } catch (error) {
      connections.delete(id)
    }
  }
}, 30000) // Every 30 seconds

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Parse query parameters
  const {
    range = 'all',
    wallet,
    id = Math.random().toString(36).substring(7)
  } = req.query

  // Validate range
  const validRanges: LeaderboardRange[] = ['daily', 'weekly', 'monthly', 'all']
  const leaderboardRange = validRanges.includes(range as LeaderboardRange)
    ? (range as LeaderboardRange)
    : 'all'

  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  })

  // Store connection
  const connectionId = id as string
  connections.set(connectionId, {
    res,
    range: leaderboardRange,
    wallet: wallet as string,
    lastSent: Date.now()
  })

  console.log(`SSE connection opened: ${connectionId} (range: ${leaderboardRange}, connections: ${connections.size})`)

  // Send initial data
  const sendInitialData = async () => {
    try {
      const leaderboard = await LeaderboardService.getLeaderboard(leaderboardRange, 100)

      let userRank = undefined
      if (wallet) {
        userRank = await LeaderboardService.getUserRank(wallet as string, leaderboardRange)
      }

      const data = {
        type: 'initial_data',
        range: leaderboardRange,
        leaderboard,
        timestamp: Date.now(),
        userRank
      }

      res.write(`data: ${JSON.stringify(data)}\n\n`)
    } catch (error) {
      console.error('Error sending initial leaderboard data:', error)
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: 'Failed to load leaderboard data',
        timestamp: Date.now()
      })}\n\n`)
    }
  }

  sendInitialData()

  // Handle client disconnect
  req.on('close', () => {
    connections.delete(connectionId)
    console.log(`SSE connection closed: ${connectionId} (connections: ${connections.size})`)
  })

  req.on('error', () => {
    connections.delete(connectionId)
  })
}

// Export for use in other parts of the application
export { connections }