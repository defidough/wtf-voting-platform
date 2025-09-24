// TypeScript types for Supabase database schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          wallet: string
          xp_vote: number
          xp_presale: number
          xp_builder: number
          xp_total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          wallet: string
          xp_vote?: number
          xp_presale?: number
          xp_builder?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          wallet?: string
          xp_vote?: number
          xp_presale?: number
          xp_builder?: number
          updated_at?: string
        }
      }
      xp_log: {
        Row: {
          id: string
          wallet: string
          action: 'vote' | 'presale' | 'builder' | 'bonus' | 'penalty'
          amount: number
          project_id: string | null
          tx_hash: string | null
          metadata: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          wallet: string
          action: 'vote' | 'presale' | 'builder' | 'bonus' | 'penalty'
          amount: number
          project_id?: string | null
          tx_hash?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          wallet?: string
          action?: 'vote' | 'presale' | 'builder' | 'bonus' | 'penalty'
          amount?: number
          project_id?: string | null
          tx_hash?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          wallet: string
          project_id: string
          votes_cast: number
          created_at: string
        }
        Insert: {
          id?: string
          wallet: string
          project_id: string
          votes_cast: number
          created_at?: string
        }
        Update: {
          id?: string
          wallet?: string
          project_id?: string
          votes_cast?: number
          created_at?: string
        }
      }
      mints: {
        Row: {
          id: string
          wallet: string
          project_id: string
          nfts: number
          tx_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          wallet: string
          project_id: string
          nfts: number
          tx_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          wallet?: string
          project_id?: string
          nfts?: number
          tx_hash?: string
          created_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          wallet: string
          project_name: string
          slug: string
          logo_url: string | null
          description: string | null
          status: 'pending' | 'active' | 'approved' | 'rejected' | 'completed'
          metadata: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet: string
          project_name: string
          slug: string
          logo_url?: string | null
          description?: string | null
          status?: 'pending' | 'active' | 'approved' | 'rejected' | 'completed'
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet?: string
          project_name?: string
          slug?: string
          logo_url?: string | null
          description?: string | null
          status?: 'pending' | 'active' | 'approved' | 'rejected' | 'completed'
          metadata?: Record<string, any> | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_xp: {
        Args: {
          user_wallet: string
          xp_action: string
          xp_amount: number
          related_project_id?: string
          transaction_hash?: string
          extra_metadata?: Record<string, any>
        }
        Returns: boolean
      }
      get_leaderboard: {
        Args: {
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          rank: number
          wallet: string
          xp_total: number
          xp_vote: number
          xp_presale: number
          xp_builder: number
        }[]
      }
      get_user_xp_history: {
        Args: {
          user_wallet: string
          limit_count?: number
        }
        Returns: {
          action: string
          amount: number
          project_id: string | null
          tx_hash: string | null
          created_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier use
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type XPLog = Database['public']['Tables']['xp_log']['Row']
export type XPLogInsert = Database['public']['Tables']['xp_log']['Insert']

export type Vote = Database['public']['Tables']['votes']['Row']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']

export type Mint = Database['public']['Tables']['mints']['Row']
export type MintInsert = Database['public']['Tables']['mints']['Insert']

export type Proposal = Database['public']['Tables']['proposals']['Row']
export type ProposalInsert = Database['public']['Tables']['proposals']['Insert']
export type ProposalUpdate = Database['public']['Tables']['proposals']['Update']

export type LeaderboardEntry = Database['public']['Functions']['get_leaderboard']['Returns'][0]
export type XPHistoryEntry = Database['public']['Functions']['get_user_xp_history']['Returns'][0]

// Helper types
export type XPAction = 'vote' | 'presale' | 'builder' | 'bonus' | 'penalty'
export type ProposalStatus = 'pending' | 'active' | 'approved' | 'rejected' | 'completed'