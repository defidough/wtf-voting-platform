import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase-types'

// Supabase configuration with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjI0ODQwMCwiZXhwIjoxOTYxODI0NDAwfQ.dummy-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ2MjQ4NDAwLCJleHAiOjE5NjE4MjQ0MDB9.dummy-service-key'

// Client for frontend use (with RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Admin client for backend use (bypasses RLS)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper functions for common operations
export class XPService {
  /**
   * Add XP to a user's account
   */
  static async addXP(
    wallet: string,
    action: 'vote' | 'presale' | 'builder' | 'bonus' | 'penalty',
    amount: number,
    projectId?: string,
    txHash?: string,
    metadata?: Record<string, any>
  ) {
    const { data, error } = await supabaseAdmin.rpc('add_xp', {
      user_wallet: wallet,
      xp_action: action,
      xp_amount: amount,
      related_project_id: projectId,
      transaction_hash: txHash,
      extra_metadata: metadata
    })

    if (error) {
      console.error('Error adding XP:', error)
      throw error
    }

    // Trigger leaderboard cache invalidation
    try {
      const { LeaderboardService } = await import('./leaderboard-cache')
      LeaderboardService.invalidateCache()

      // Broadcast real-time update
      const { broadcastLeaderboardUpdate } = await import('../pages/api/leaderboard/stream')
      await broadcastLeaderboardUpdate()
    } catch (err) {
      console.warn('Could not update leaderboard cache:', err)
    }

    return data
  }

  /**
   * Get user profile with XP totals
   */
  static async getUserProfile(wallet: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet', wallet)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user profile:', error)
      throw error
    }

    return data
  }

  /**
   * Get leaderboard
   */
  static async getLeaderboard(limit = 100, offset = 0) {
    const { data, error } = await supabase.rpc('get_leaderboard', {
      limit_count: limit,
      offset_count: offset
    })

    if (error) {
      console.error('Error fetching leaderboard:', error)
      throw error
    }

    return data
  }

  /**
   * Get user's XP history
   */
  static async getUserXPHistory(wallet: string, limit = 50) {
    const { data, error } = await supabase.rpc('get_user_xp_history', {
      user_wallet: wallet,
      limit_count: limit
    })

    if (error) {
      console.error('Error fetching XP history:', error)
      throw error
    }

    return data
  }

  /**
   * Ensure user exists in database
   */
  static async ensureUser(wallet: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert({ wallet }, { onConflict: 'wallet' })
      .select()
      .single()

    if (error) {
      console.error('Error ensuring user exists:', error)
      throw error
    }

    return data
  }
}

export class VotingService {
  /**
   * Record a vote
   */
  static async recordVote(wallet: string, projectId: string, votesCast: number) {
    // Ensure user exists
    await XPService.ensureUser(wallet)

    // Record the vote
    const { data: vote, error: voteError } = await supabaseAdmin
      .from('votes')
      .upsert({
        wallet,
        project_id: projectId,
        votes_cast: votesCast
      }, { onConflict: 'wallet,project_id' })
      .select()
      .single()

    if (voteError) {
      console.error('Error recording vote:', voteError)
      throw voteError
    }

    // Add XP for voting
    await XPService.addXP(wallet, 'vote', votesCast * 2, projectId) // 2 XP per vote

    return vote
  }

  /**
   * Get user's votes for a project
   */
  static async getUserVotes(wallet: string, projectId: string) {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('wallet', wallet)
      .eq('project_id', projectId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user votes:', error)
      throw error
    }

    return data
  }

  /**
   * Get all votes for a project
   */
  static async getProjectVotes(projectId: string) {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('project_id', projectId)

    if (error) {
      console.error('Error fetching project votes:', error)
      throw error
    }

    return data
  }
}

export class ProposalService {
  /**
   * Create a new proposal
   */
  static async createProposal(
    wallet: string,
    projectName: string,
    slug: string,
    logoUrl?: string,
    description?: string,
    metadata?: Record<string, any>
  ) {
    // Ensure user exists
    await XPService.ensureUser(wallet)

    // Create proposal
    const { data: proposal, error } = await supabaseAdmin
      .from('proposals')
      .insert({
        wallet,
        project_name: projectName,
        slug,
        logo_url: logoUrl,
        description,
        metadata
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating proposal:', error)
      throw error
    }

    // Add XP for creating proposal
    await XPService.addXP(wallet, 'builder', 50, slug) // 50 XP for creating proposal

    return proposal
  }

  /**
   * Update proposal status
   */
  static async updateProposalStatus(
    proposalId: string,
    status: 'pending' | 'active' | 'approved' | 'rejected' | 'completed'
  ) {
    const { data, error } = await supabaseAdmin
      .from('proposals')
      .update({ status })
      .eq('id', proposalId)
      .select()
      .single()

    if (error) {
      console.error('Error updating proposal status:', error)
      throw error
    }

    // Add bonus XP for approved proposals
    if (status === 'approved') {
      await XPService.addXP(data.wallet, 'builder', 100, data.slug) // 100 XP bonus for approval
    }

    return data
  }

  /**
   * Get proposal by slug
   */
  static async getProposal(slug: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching proposal:', error)
      throw error
    }

    return data
  }

  /**
   * Get all proposals
   */
  static async getProposals(status?: string, limit = 50) {
    let query = supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching proposals:', error)
      throw error
    }

    return data
  }
}

export class MintService {
  /**
   * Record an NFT mint
   */
  static async recordMint(
    wallet: string,
    projectId: string,
    nftCount: number,
    txHash: string
  ) {
    // Ensure user exists
    await XPService.ensureUser(wallet)

    // Record the mint
    const { data: mint, error } = await supabaseAdmin
      .from('mints')
      .insert({
        wallet,
        project_id: projectId,
        nfts: nftCount,
        tx_hash: txHash
      })
      .select()
      .single()

    if (error) {
      console.error('Error recording mint:', error)
      throw error
    }

    // Add XP for presale participation
    await XPService.addXP(wallet, 'presale', nftCount * 5, projectId, txHash) // 5 XP per NFT

    return mint
  }

  /**
   * Get user's mints for a project
   */
  static async getUserMints(wallet: string, projectId?: string) {
    let query = supabase
      .from('mints')
      .select('*')
      .eq('wallet', wallet)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching user mints:', error)
      throw error
    }

    return data
  }
}

// Environment validation
const hasRealSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!hasRealSupabaseConfig) {
  console.warn('⚠️ Using placeholder Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for full functionality.')
}

if (typeof window === 'undefined' && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Missing SUPABASE_SERVICE_ROLE_KEY - some backend functions may not work')
}