import { mockUsers, User, XPLogEntry } from './mockData'

export const awardXP = (wallet: string, amount: number): void => {
  const existingUserIndex = mockUsers.findIndex(user => user.wallet === wallet)
  const logEntry: XPLogEntry = {
    type: 'vote',
    amount,
    timestamp: new Date()
  }

  if (existingUserIndex !== -1) {
    // Update existing user
    mockUsers[existingUserIndex].voteXP += amount
    mockUsers[existingUserIndex].votesCast += amount
    mockUsers[existingUserIndex].totalXP =
      mockUsers[existingUserIndex].voteXP +
      mockUsers[existingUserIndex].presaleXP +
      mockUsers[existingUserIndex].builderXP
    mockUsers[existingUserIndex].xpLogs.unshift(logEntry)
  } else {
    // Create new user
    const newUser: User = {
      wallet,
      voteXP: amount,
      presaleXP: 0,
      builderXP: 0,
      totalXP: amount,
      votesCast: amount,
      mintsContributed: 0,
      projectsSubmitted: 0,
      xpLogs: [logEntry]
    }
    mockUsers.push(newUser)
  }
}

export const getUserByWallet = (wallet: string): User | undefined => {
  return mockUsers.find(user => user.wallet === wallet)
}

export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'allTime'

export const getTimeframeBounds = (timeframe: Timeframe): Date | null => {
  const now = new Date()
  switch (timeframe) {
    case 'daily':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case 'weekly':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'monthly':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'allTime':
      return null
  }
}

export const calculateTimeframeXP = (user: User, timeframe: Timeframe) => {
  const cutoff = getTimeframeBounds(timeframe)

  if (!cutoff) {
    // All time - use existing totals
    return {
      voteXP: user.voteXP,
      presaleXP: user.presaleXP,
      builderXP: user.builderXP,
      totalXP: user.totalXP
    }
  }

  // Filter logs within timeframe
  const relevantLogs = user.xpLogs.filter(log => log.timestamp >= cutoff)

  const voteXP = relevantLogs
    .filter(log => log.type === 'vote')
    .reduce((sum, log) => sum + log.amount, 0)

  const presaleXP = relevantLogs
    .filter(log => log.type === 'presale')
    .reduce((sum, log) => sum + log.amount, 0)

  const builderXP = relevantLogs
    .filter(log => log.type === 'builder')
    .reduce((sum, log) => sum + log.amount, 0)

  return {
    voteXP,
    presaleXP,
    builderXP,
    totalXP: voteXP + presaleXP + builderXP
  }
}

export const getLeaderboard = (
  sortBy: 'totalXP' | 'voteXP' | 'presaleXP' | 'builderXP' = 'totalXP',
  timeframe: Timeframe = 'allTime'
): User[] => {
  const usersWithTimeframeXP = mockUsers.map(user => {
    const timeframeXP = calculateTimeframeXP(user, timeframe)
    return {
      ...user,
      ...timeframeXP
    }
  })

  return usersWithTimeframeXP.sort((a, b) => b[sortBy] - a[sortBy])
}

export const awardPresaleXP = (wallet: string, mints: number): void => {
  const existingUserIndex = mockUsers.findIndex(user => user.wallet === wallet)
  const logEntry: XPLogEntry = {
    type: 'presale',
    amount: mints,
    timestamp: new Date()
  }

  if (existingUserIndex !== -1) {
    // Update existing user
    mockUsers[existingUserIndex].presaleXP += mints
    mockUsers[existingUserIndex].mintsContributed += mints
    mockUsers[existingUserIndex].totalXP =
      mockUsers[existingUserIndex].voteXP +
      mockUsers[existingUserIndex].presaleXP +
      mockUsers[existingUserIndex].builderXP
    mockUsers[existingUserIndex].xpLogs.unshift(logEntry)
  } else {
    // Create new user
    const newUser: User = {
      wallet,
      voteXP: 0,
      presaleXP: mints,
      builderXP: 0,
      totalXP: mints,
      votesCast: 0,
      mintsContributed: mints,
      projectsSubmitted: 0,
      xpLogs: [logEntry]
    }
    mockUsers.push(newUser)
  }
}

export const awardBuilderXP = (wallet: string, amount: number): void => {
  const existingUserIndex = mockUsers.findIndex(user => user.wallet === wallet)
  const logEntry: XPLogEntry = {
    type: 'builder',
    amount,
    timestamp: new Date()
  }

  if (existingUserIndex !== -1) {
    // Update existing user
    mockUsers[existingUserIndex].builderXP += amount
    mockUsers[existingUserIndex].projectsSubmitted += 1
    mockUsers[existingUserIndex].totalXP =
      mockUsers[existingUserIndex].voteXP +
      mockUsers[existingUserIndex].presaleXP +
      mockUsers[existingUserIndex].builderXP
    mockUsers[existingUserIndex].xpLogs.unshift(logEntry)
  } else {
    // Create new user
    const newUser: User = {
      wallet,
      voteXP: 0,
      presaleXP: 0,
      builderXP: amount,
      totalXP: amount,
      votesCast: 0,
      mintsContributed: 0,
      projectsSubmitted: 1,
      xpLogs: [logEntry]
    }
    mockUsers.push(newUser)
  }
}

export const shortenWallet = (wallet: string): string => {
  if (wallet.length < 10) return wallet
  return `${wallet.slice(0, 6)}…${wallet.slice(-4)}`
}

// WTF Holder Tier System
export interface WTFHolderTier {
  id: number
  name: string
  minBalance: number
  bonusVotes: number
  color: string
}

export const WTF_HOLDER_TIERS: WTFHolderTier[] = [
  { id: 1, name: 'Supporter', minBalance: 1_000_000, bonusVotes: 1, color: '#8B5CF6' },
  { id: 2, name: 'Contributor', minBalance: 10_000_000, bonusVotes: 3, color: '#7C3AED' },
  { id: 3, name: 'Advocate', minBalance: 25_000_000, bonusVotes: 6, color: '#6D28D9' },
  { id: 4, name: 'Builder', minBalance: 50_000_000, bonusVotes: 10, color: '#5B21B6' },
  { id: 5, name: 'Leader', minBalance: 100_000_000, bonusVotes: 15, color: '#4C1D95' },
  { id: 6, name: 'Whale', minBalance: 250_000_000, bonusVotes: 25, color: '#3730A3' },
  { id: 7, name: 'Guardian', minBalance: 500_000_000, bonusVotes: 40, color: '#312E81' },
  { id: 8, name: 'Titan', minBalance: 750_000_000, bonusVotes: 60, color: '#1E1B4B' },
  { id: 9, name: 'OG', minBalance: 1_000_000_000, bonusVotes: 100, color: '#FFE500' },
  { id: 10, name: 'Legendary', minBalance: 2_000_000_000, bonusVotes: 151, color: '#FF8C00' }
]

import { fetchWTFBalance } from './blockchain'

// Cache for WTF balances to avoid excessive blockchain calls
const wtfBalanceCache: Record<string, { balance: number, timestamp: number }> = {}
const CACHE_DURATION = 60000 // 1 minute cache

// Mock WTF token balances for users (fallback for demo purposes)
const mockWTFBalances: Record<string, number> = {
  '0x1234567890abcdef1234567890abcdef12345678': 125_000_000, // Leader tier
  '0xabcdef1234567890abcdef1234567890abcdef12': 75_000_000,  // Builder tier
  '0x9876543210fedcba9876543210fedcba98765432': 500_000_000, // Guardian tier
  '0xfedcba9876543210fedcba9876543210fedcba98': 15_000_000,  // Contributor tier
  '0x5555666677778888999900001111222233334444': 2_500_000_000, // Legendary tier
}

export const getWTFBalance = (wallet: string): number => {
  // Return cached balance if still valid
  const cached = wtfBalanceCache[wallet.toLowerCase()]
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.balance
  }

  // Return mock balance for demo wallets
  return mockWTFBalances[wallet.toLowerCase()] || 0
}

/**
 * Fetch real WTF balance from blockchain and update cache
 * @param wallet - Wallet address to fetch balance for
 * @returns Promise<number> - Real balance from blockchain
 */
export const fetchRealWTFBalance = async (wallet: string): Promise<number> => {
  try {
    if (!wallet || wallet === '0x0') {
      return 0
    }

    const normalizedWallet = wallet.toLowerCase()
    const balance = await fetchWTFBalance(wallet)

    // Update cache
    wtfBalanceCache[normalizedWallet] = {
      balance,
      timestamp: Date.now()
    }

    return balance
  } catch (error) {
    console.error('Error fetching real WTF balance:', error)
    // Return mock balance as fallback
    return mockWTFBalances[wallet.toLowerCase()] || 0
  }
}

/**
 * Get WTF balance with real-time blockchain data when possible
 * @param wallet - Wallet address
 * @param useRealData - Whether to fetch from blockchain (default: true)
 * @returns Promise<number> - Balance (cached, real, or mock)
 */
export const getWTFBalanceAsync = async (wallet: string, useRealData = true): Promise<number> => {
  if (!useRealData) {
    return getWTFBalance(wallet)
  }

  try {
    return await fetchRealWTFBalance(wallet)
  } catch (error) {
    console.error('Failed to fetch real balance, using cached/mock data:', error)
    return getWTFBalance(wallet)
  }
}

export const getUserTier = (wallet: string): WTFHolderTier | null => {
  const balance = getWTFBalance(wallet)

  // Find the highest tier the user qualifies for
  for (let i = WTF_HOLDER_TIERS.length - 1; i >= 0; i--) {
    if (balance >= WTF_HOLDER_TIERS[i].minBalance) {
      return WTF_HOLDER_TIERS[i]
    }
  }

  return null
}

export const getNextTier = (wallet: string): WTFHolderTier | null => {
  const currentTier = getUserTier(wallet)

  if (!currentTier) {
    return WTF_HOLDER_TIERS[0] // First tier
  }

  const currentTierIndex = WTF_HOLDER_TIERS.findIndex(tier => tier.id === currentTier.id)

  if (currentTierIndex < WTF_HOLDER_TIERS.length - 1) {
    return WTF_HOLDER_TIERS[currentTierIndex + 1]
  }

  return null // Already at max tier
}

export const getTierProgress = (wallet: string): { current: number, required: number, percentage: number } => {
  const balance = getWTFBalance(wallet)
  const nextTier = getNextTier(wallet)

  if (!nextTier) {
    return { current: balance, required: balance, percentage: 100 }
  }

  const currentTier = getUserTier(wallet)
  const currentMin = currentTier?.minBalance || 0

  return {
    current: balance - currentMin,
    required: nextTier.minBalance - currentMin,
    percentage: Math.min(100, ((balance - currentMin) / (nextTier.minBalance - currentMin)) * 100)
  }
}

export const formatWTFBalance = (balance: number): string => {
  if (balance >= 1_000_000_000) {
    return `${(balance / 1_000_000_000).toFixed(1)}B`
  } else if (balance >= 1_000_000) {
    return `${(balance / 1_000_000).toFixed(1)}M`
  } else if (balance >= 1_000) {
    return `${(balance / 1_000).toFixed(1)}K`
  }
  return balance.toString()
}

/**
 * Get user tier based on real blockchain balance (async version)
 * @param wallet - Wallet address
 * @param useRealData - Whether to use real blockchain data
 * @returns Promise<WTFHolderTier | null> - User's tier or null
 */
export const getUserTierAsync = async (wallet: string, useRealData = true): Promise<WTFHolderTier | null> => {
  const balance = await getWTFBalanceAsync(wallet, useRealData)

  // Find the highest tier the user qualifies for
  for (let i = WTF_HOLDER_TIERS.length - 1; i >= 0; i--) {
    if (balance >= WTF_HOLDER_TIERS[i].minBalance) {
      return WTF_HOLDER_TIERS[i]
    }
  }

  return null
}

/**
 * Get next tier based on real blockchain balance (async version)
 * @param wallet - Wallet address
 * @param useRealData - Whether to use real blockchain data
 * @returns Promise<WTFHolderTier | null> - Next tier or null
 */
export const getNextTierAsync = async (wallet: string, useRealData = true): Promise<WTFHolderTier | null> => {
  const currentTier = await getUserTierAsync(wallet, useRealData)

  if (!currentTier) {
    return WTF_HOLDER_TIERS[0] // First tier
  }

  const currentTierIndex = WTF_HOLDER_TIERS.findIndex(tier => tier.id === currentTier.id)

  if (currentTierIndex < WTF_HOLDER_TIERS.length - 1) {
    return WTF_HOLDER_TIERS[currentTierIndex + 1]
  }

  return null // Already at max tier
}

/**
 * Get tier progress based on real blockchain balance (async version)
 * @param wallet - Wallet address
 * @param useRealData - Whether to use real blockchain data
 * @returns Promise<{current: number, required: number, percentage: number}> - Progress data
 */
export const getTierProgressAsync = async (
  wallet: string,
  useRealData = true
): Promise<{ current: number, required: number, percentage: number }> => {
  const balance = await getWTFBalanceAsync(wallet, useRealData)
  const nextTier = await getNextTierAsync(wallet, useRealData)

  if (!nextTier) {
    return { current: balance, required: balance, percentage: 100 }
  }

  const currentTier = await getUserTierAsync(wallet, useRealData)
  const currentMin = currentTier?.minBalance || 0

  return {
    current: balance - currentMin,
    required: nextTier.minBalance - currentMin,
    percentage: Math.min(100, ((balance - currentMin) / (nextTier.minBalance - currentMin)) * 100)
  }
}