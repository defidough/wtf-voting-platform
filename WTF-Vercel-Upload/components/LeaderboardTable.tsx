import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getLeaderboard, shortenWallet, Timeframe } from '@/lib/xpSystem'
import { useAuthenticatedWallet } from '@/contexts/AuthContext'

type SortBy = 'totalXP' | 'voteXP' | 'presaleXP' | 'builderXP'

interface LeaderboardEntry {
  wallet: string
  vote_xp: number
  presale_xp: number
  builder_xp: number
  total_xp: number
  rank: number
  last_activity: string | null
}

interface UserRank {
  rank: number | null
  entry: LeaderboardEntry | null
}

export default function LeaderboardTable() {
  const connectedWallet = useAuthenticatedWallet()
  const [sortBy, setSortBy] = useState<SortBy>('totalXP')
  const [timeframe, setTimeframe] = useState<Timeframe>('allTime')
  const [searchWallet, setSearchWallet] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [apiLeaderboard, setApiLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<UserRank | null>(null)
  const [useApi, setUseApi] = useState(false)
  const [loading, setLoading] = useState(true)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Map timeframe to API format
  const mapTimeframeToApi = (tf: Timeframe) => {
    switch (tf) {
      case 'daily': return 'daily'
      case 'weekly': return 'weekly'
      case 'monthly': return 'monthly'
      case 'allTime': return 'all'
      default: return 'all'
    }
  }

  // Fetch data from API
  const fetchApiLeaderboard = async (forceRefresh = false) => {
    try {
      const params = new URLSearchParams({
        range: mapTimeframeToApi(timeframe),
        limit: '100',
        refresh: forceRefresh.toString()
      })

      if (connectedWallet) {
        params.append('wallet', connectedWallet)
      }

      let response = await fetch(`/api/leaderboard?${params}`)
      let data = await response.json()

      // Fallback to demo data if database is not configured
      if (!data.success && data.error === 'Database not configured') {
        console.log('Database not configured, using demo data')
        response = await fetch(`/api/leaderboard/demo?${params}`)
        data = await response.json()
      }

      if (data.success) {
        setApiLeaderboard(data.data.leaderboard)
        setUserRank(data.data.userRank || null)
        setLastUpdated(new Date())
        setUseApi(true)
      } else {
        console.warn('API failed, using mock data:', data.error)
        setUseApi(false)
      }
    } catch (error) {
      console.warn('API error, using mock data:', error)
      setUseApi(false)
    } finally {
      setLoading(false)
    }
  }

  // Set up real-time updates
  const setupRealTimeUpdates = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    try {
      const params = new URLSearchParams({ range: mapTimeframeToApi(timeframe) })
      if (connectedWallet) {
        params.append('wallet', connectedWallet)
      }

      const eventSource = new EventSource(`/api/leaderboard/stream?${params}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsLive(true)
        console.log('Connected to leaderboard real-time updates')
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          switch (data.type) {
            case 'initial_data':
            case 'leaderboard_update':
              if (data.range === mapTimeframeToApi(timeframe)) {
                setApiLeaderboard(data.leaderboard)
                setUserRank(data.userRank || null)
                setLastUpdated(new Date(data.timestamp))
                setUseApi(true)
              }
              break
            case 'heartbeat':
              break
            case 'error':
              console.warn('SSE error:', data.message)
              break
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err)
        }
      }

      eventSource.onerror = () => {
        setIsLive(false)
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            setupRealTimeUpdates()
          }
        }, 5000)
      }

    } catch (err) {
      console.error('Error setting up real-time updates:', err)
      setIsLive(false)
    }
  }

  // Initialize API data
  useEffect(() => {
    setLoading(true)
    fetchApiLeaderboard()
    setupRealTimeUpdates()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [timeframe, connectedWallet])

  // Get leaderboard data (API or mock)
  const leaderboard = useApi ?
    apiLeaderboard.map(entry => ({
      wallet: entry.wallet,
      voteXP: entry.vote_xp,
      presaleXP: entry.presale_xp,
      builderXP: entry.builder_xp,
      totalXP: entry.total_xp,
      votesCast: entry.vote_xp, // Approximate
      mintsContributed: entry.presale_xp, // Approximate
      projectsSubmitted: Math.floor(entry.builder_xp / 50), // Approximate
      xpLogs: [] // Not available from API
    })) :
    getLeaderboard(sortBy, timeframe)

  const filteredLeaderboard = searchWallet
    ? leaderboard.filter(user =>
        user.wallet.toLowerCase().includes(searchWallet.toLowerCase())
      )
    : leaderboard

  // Sort data if using API
  const sortedLeaderboard = useApi ?
    [...filteredLeaderboard].sort((a, b) => b[sortBy] - a[sortBy]) :
    filteredLeaderboard

  const getSortButtonClass = (type: SortBy) => {
    const baseClasses = "px-4 py-2 text-sm rounded-xl transition-all duration-300 font-medium"
    if (sortBy === type) {
      return `${baseClasses} bg-gradient-to-r from-[#FFE500] to-[#FF8C00] text-black shadow-lg hover:shadow-[0_0_20px_rgba(255,229,0,0.4)]`
    }
    return `${baseClasses} bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white border border-gray-700/50`
  }

  const getTimeframeButtonClass = (type: Timeframe) => {
    const baseClasses = "px-4 py-2 text-sm rounded-xl transition-all duration-300 font-medium"
    if (timeframe === type) {
      return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]`
    }
    return `${baseClasses} bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white border border-gray-700/50`
  }

  const exportToCSV = () => {
    const headers = ['Rank', 'Wallet', 'Vote XP', 'Presale XP', 'Builder XP', 'Total XP']
    const csvContent = [
      headers.join(','),
      ...filteredLeaderboard.map((user, index) => {
        const actualRank = leaderboard.findIndex(u => u.wallet === user.wallet) + 1
        return [
          actualRank,
          user.wallet,
          user.voteXP,
          user.presaleXP,
          user.builderXP,
          user.totalXP
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leaderboard_${timeframe}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Glowing gradient border */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/20 via-[#FF8C00]/20 to-[#FF4500]/20 p-[1px]">
          <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
        </div>

        <div className="relative p-6 space-y-6">
          {/* Real-time Status Indicator - Moved above filters */}
          {useApi && (
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/40 rounded-xl border border-gray-700/50">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400' : 'bg-red-400'} ${isLive ? 'animate-pulse' : ''}`} />
                <span className={`text-sm font-medium ${isLive ? 'text-green-400' : 'text-red-400'}`}>
                  {isLive ? 'Live' : 'Offline'}
                </span>
                {lastUpdated && (
                  <>
                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                    <span className="text-sm text-gray-400">
                      Updated {lastUpdated.toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Balanced Controls Layout */}
          <div className="space-y-6">
            {/* Top Row: Timeframe Filter - Centered */}
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <span className="font-body text-sm font-medium text-gray-300 mr-2">Timeframe:</span>
              <button
                onClick={() => setTimeframe('daily')}
                className={getTimeframeButtonClass('daily')}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeframe('weekly')}
                className={getTimeframeButtonClass('weekly')}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={getTimeframeButtonClass('monthly')}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeframe('allTime')}
                className={getTimeframeButtonClass('allTime')}
              >
                All Time
              </button>
            </div>

            {/* Bottom Row: Sort Options and Search/Actions */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Left: Sort By Options */}
              <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-start">
                <span className="font-body text-sm font-medium text-gray-300 mr-2">Sort by:</span>
                <button
                  onClick={() => setSortBy('totalXP')}
                  className={getSortButtonClass('totalXP')}
                >
                  Total XP
                </button>
                <button
                  onClick={() => setSortBy('voteXP')}
                  className={getSortButtonClass('voteXP')}
                >
                  Vote XP
                </button>
                <button
                  onClick={() => setSortBy('presaleXP')}
                  className={getSortButtonClass('presaleXP')}
                >
                  Presale XP
                </button>
                <button
                  onClick={() => setSortBy('builderXP')}
                  className={getSortButtonClass('builderXP')}
                >
                  Builder XP
                </button>
              </div>

              {/* Right: Search and Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-end">
                <div className="flex items-center gap-3">
                  <label className="font-body text-sm font-medium text-gray-300">Search:</label>
                  <input
                    type="text"
                    placeholder="Enter wallet address"
                    value={searchWallet}
                    onChange={(e) => setSearchWallet(e.target.value)}
                    className="px-4 py-2 bg-gray-800/60 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE500]/50 focus:border-[#FFE500]/50 transition-all duration-300"
                  />
                </div>
                {useApi && (
                  <motion.button
                    onClick={() => fetchApiLeaderboard(true)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? '⟳' : '↻'} Refresh
                  </motion.button>
                )}
                <motion.button
                  onClick={exportToCSV}
                  className="px-6 py-2 bg-gradient-to-r from-[#FFE500] to-[#FF8C00] text-black text-sm font-semibold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(255,229,0,0.4)] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Export CSV
                </motion.button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* User Rank Display */}
      {connectedWallet && userRank?.rank && useApi && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px]">
            <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
          </div>
          <div className="relative p-4 text-center">
            <span className="text-gray-300">Your Rank: </span>
            <span className="text-[#FFE500] font-bold text-lg">#{userRank.rank}</span>
            {userRank.entry && (
              <span className="text-gray-400 ml-4">
                Total XP: <span className="text-white font-semibold">{userRank.entry.total_xp}</span>
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Leaderboard Table */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Glowing gradient border */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/20 via-[#FF8C00]/20 to-[#FF4500]/20 p-[1px]">
          <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
        </div>

        <div className="relative overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-900/80 to-gray-800/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Vote XP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Presale XP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Builder XP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Total XP
                  </th>
                </tr>
              </thead>
              <motion.tbody
                className="divide-y divide-gray-800/50"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="bg-gradient-to-r from-gray-900/60 to-gray-800/60">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700/50 rounded animate-pulse w-8"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700/50 rounded animate-pulse w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700/50 rounded animate-pulse w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700/50 rounded animate-pulse w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700/50 rounded animate-pulse w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700/50 rounded animate-pulse w-16"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredLeaderboard.map((user, index) => {
                  const actualRank = leaderboard.findIndex(u => u.wallet === user.wallet) + 1
                  const isTopThree = actualRank <= 3
                  const isCurrentUser = connectedWallet && user.wallet.toLowerCase() === connectedWallet.toLowerCase()

                  return (
                    <motion.tr
                      key={user.wallet}
                      variants={rowVariants}
                      className={`group transition-all duration-300 ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-[#FFE500]/20 to-[#FF8C00]/20 border-l-4 border-[#FFE500] shadow-[0_0_20px_rgba(255,229,0,0.2)]'
                          : index % 2 === 0
                          ? 'bg-gradient-to-r from-gray-900/60 to-gray-800/60'
                          : 'bg-gradient-to-r from-gray-800/60 to-gray-900/60'
                      } hover:bg-gradient-to-r hover:from-[#FFE500]/10 hover:to-[#FF8C00]/10 hover:shadow-[0_0_30px_rgba(255,229,0,0.1)]`}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`font-display text-sm font-bold ${isTopThree ? 'text-[#FFE500]' : 'text-white'}`}>
                            #{actualRank}
                          </span>
                          {actualRank === 1 && (
                            <div className="ml-3 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              1
                            </div>
                          )}
                          {actualRank === 2 && (
                            <div className="ml-3 w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              2
                            </div>
                          )}
                          {actualRank === 3 && (
                            <div className="ml-3 w-6 h-6 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              3
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm transition-colors duration-300 ${
                            isCurrentUser ? 'text-[#FFE500] font-bold' : 'text-gray-300 group-hover:text-white'
                          }`}>
                            {shortenWallet(user.wallet)}
                          </span>
                          {isCurrentUser && (
                            <span className="px-2 py-1 bg-[#FFE500] text-black text-xs font-bold rounded-full">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-display text-sm font-semibold text-blue-400">
                          {user.voteXP}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-display text-sm font-semibold text-[#FFE500]">
                          {user.presaleXP}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-display text-sm font-semibold text-orange-400">
                          {user.builderXP}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-display text-sm font-bold text-white">
                          {user.totalXP}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </motion.tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}