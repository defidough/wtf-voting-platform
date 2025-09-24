// In-memory cache for leaderboard data
interface LeaderboardEntry {
  wallet: string
  vote_xp: number
  presale_xp: number
  builder_xp: number
  total_xp: number
  rank: number
  last_activity: string | null
}

interface CachedLeaderboard {
  data: LeaderboardEntry[]
  lastUpdated: number
  ttl: number // Time to live in milliseconds
}

type LeaderboardRange = 'daily' | 'weekly' | 'monthly' | 'all'

class LeaderboardCache {
  private static instance: LeaderboardCache
  private cache = new Map<LeaderboardRange, CachedLeaderboard>()
  private readonly CACHE_TTL = {
    daily: 2 * 60 * 1000,    // 2 minutes
    weekly: 5 * 60 * 1000,   // 5 minutes
    monthly: 10 * 60 * 1000, // 10 minutes
    all: 15 * 60 * 1000      // 15 minutes
  }

  private constructor() {}

  static getInstance(): LeaderboardCache {
    if (!LeaderboardCache.instance) {
      LeaderboardCache.instance = new LeaderboardCache()
    }
    return LeaderboardCache.instance
  }

  // Get cached leaderboard data
  get(range: LeaderboardRange): LeaderboardEntry[] | null {
    const cached = this.cache.get(range)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.lastUpdated > cached.ttl) {
      this.cache.delete(range)
      return null
    }

    return cached.data
  }

  // Set leaderboard data in cache
  set(range: LeaderboardRange, data: LeaderboardEntry[]): void {
    const cached: CachedLeaderboard = {
      data,
      lastUpdated: Date.now(),
      ttl: this.CACHE_TTL[range]
    }
    this.cache.set(range, cached)
  }

  // Clear cache for a specific range or all
  clear(range?: LeaderboardRange): void {
    if (range) {
      this.cache.delete(range)
    } else {
      this.cache.clear()
    }
  }

  // Get cache status
  getStatus() {
    const status: Record<string, any> = {}
    for (const [range, cached] of this.cache.entries()) {
      const age = Date.now() - cached.lastUpdated
      status[range] = {
        entries: cached.data.length,
        ageMs: age,
        ttlMs: cached.ttl,
        isExpired: age > cached.ttl
      }
    }
    return status
  }

  // Force refresh all caches
  invalidateAll(): void {
    this.cache.clear()
  }
}

// Leaderboard service with database queries
export class LeaderboardService {
  private static cache = LeaderboardCache.getInstance()

  // Get leaderboard data with caching
  static async getLeaderboard(
    range: LeaderboardRange = 'all',
    limit = 100,
    forceRefresh = false
  ): Promise<LeaderboardEntry[]> {
    // Check cache first
    if (!forceRefresh) {
      const cached = this.cache.get(range)
      if (cached) {
        console.log(`Leaderboard cache hit for ${range}`)
        return cached.slice(0, limit)
      }
    }

    console.log(`Fetching fresh leaderboard data for ${range}`)

    try {
      const data = await this.fetchLeaderboardFromDatabase(range, limit)

      // Add rank to each entry
      const rankedData = data.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

      // Cache the results
      this.cache.set(range, rankedData)

      return rankedData
    } catch (error) {
      console.error('Error fetching leaderboard:', error)

      // Return cached data if available, even if expired
      const cached = this.cache.get(range)
      if (cached) {
        console.log(`Returning stale cache for ${range} due to error`)
        return cached.slice(0, limit)
      }

      throw error
    }
  }

  // Fetch from database based on range
  private static async fetchLeaderboardFromDatabase(
    range: LeaderboardRange,
    limit: number
  ): Promise<Omit<LeaderboardEntry, 'rank'>[]> {
    const { supabaseAdmin } = await import('./supabase')

    // Calculate date range
    const now = new Date()
    let startDate: Date | null = null

    switch (range) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'weekly':
        const dayOfWeek = now.getDay()
        startDate = new Date(now.getTime() - (dayOfWeek * 24 * 60 * 60 * 1000))
        startDate.setHours(0, 0, 0, 0)
        break
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'all':
        startDate = null
        break
    }

    // Build query
    let query = supabaseAdmin
      .from('users')
      .select(`
        wallet,
        xp_total,
        xp_vote,
        xp_presale,
        xp_builder,
        updated_at
      `)

    // Add date filter for time-based ranges
    if (startDate && range !== 'all') {
      // For time-based ranges, we need to aggregate from xp_log
      const xpQuery = supabaseAdmin
        .from('xp_log')
        .select('wallet, action, amount')
        .gte('created_at', startDate.toISOString())

      const { data: xpData, error: xpError } = await xpQuery

      if (xpError) throw xpError

      // Aggregate XP by wallet and action
      const walletXP = new Map<string, {
        vote_xp: number
        presale_xp: number
        builder_xp: number
        total_xp: number
      }>()

      xpData?.forEach(entry => {
        const wallet = entry.wallet
        const current = walletXP.get(wallet) || {
          vote_xp: 0,
          presale_xp: 0,
          builder_xp: 0,
          total_xp: 0
        }

        switch (entry.action) {
          case 'vote':
            current.vote_xp += entry.amount
            break
          case 'presale':
            current.presale_xp += entry.amount
            break
          case 'builder':
            current.builder_xp += entry.amount
            break
        }
        current.total_xp += entry.amount

        walletXP.set(wallet, current)
      })

      // Convert to array and sort
      const results = Array.from(walletXP.entries()).map(([wallet, xp]) => ({
        wallet,
        vote_xp: xp.vote_xp,
        presale_xp: xp.presale_xp,
        builder_xp: xp.builder_xp,
        total_xp: xp.total_xp,
        last_activity: null // We'd need to query this separately if needed
      }))

      return results
        .sort((a, b) => b.total_xp - a.total_xp)
        .slice(0, limit)
    }

    // For 'all' range, use the users table directly
    const { data, error } = await query
      .gt('xp_total', 0)
      .order('xp_total', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (data || []).map(user => ({
      wallet: user.wallet,
      vote_xp: user.xp_vote || 0,
      presale_xp: user.xp_presale || 0,
      builder_xp: user.xp_builder || 0,
      total_xp: user.xp_total || 0,
      last_activity: user.updated_at
    }))
  }

  // Get user's rank in leaderboard
  static async getUserRank(wallet: string, range: LeaderboardRange = 'all'): Promise<{
    rank: number | null
    entry: LeaderboardEntry | null
  }> {
    try {
      const leaderboard = await this.getLeaderboard(range, 1000) // Get more entries to find user
      const userEntry = leaderboard.find(entry =>
        entry.wallet.toLowerCase() === wallet.toLowerCase()
      )

      return {
        rank: userEntry?.rank || null,
        entry: userEntry || null
      }
    } catch (error) {
      console.error('Error getting user rank:', error)
      return { rank: null, entry: null }
    }
  }

  // Invalidate cache (call when XP is updated)
  static invalidateCache(range?: LeaderboardRange): void {
    this.cache.clear(range)
  }

  // Get cache statistics
  static getCacheStats() {
    return this.cache.getStatus()
  }
}

export type { LeaderboardEntry, LeaderboardRange }
export default LeaderboardService