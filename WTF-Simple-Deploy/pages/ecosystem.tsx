import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getEcosystemLaunches, EcosystemLaunch } from '@/lib/mockData'
import { fetchGeckoTerminalData, updateLaunchWithGeckoData, POOL_ADDRESSES } from '@/lib/geckoTerminalAPI'

type SortOption = 'mcap' | 'volume' | 'presale' | 'change' | 'launched'
type McapFilter = 'all' | 'sub100k' | '100k-1m' | '1m-10m' | 'over10m'
type LaunchFilter = 'all' | 'wtf-only' | 'last7d' | 'last30d'

export default function Ecosystem() {
  const [sortBy, setSortBy] = useState<SortOption>('mcap')
  const [searchTerm, setSearchTerm] = useState('')
  const [mcapFilter, setMcapFilter] = useState<McapFilter>('all')
  const [launchFilter, setLaunchFilter] = useState<LaunchFilter>('all')
  const [showOnlyWithVolume, setShowOnlyWithVolume] = useState(false)
  const [launches, setLaunches] = useState<EcosystemLaunch[]>(getEcosystemLaunches())
  const [isUpdatingData, setIsUpdatingData] = useState(false)

  // Function to update launches with live data
  const updateLaunchesWithLiveData = async () => {
    setIsUpdatingData(true)
    const baseLaunches = getEcosystemLaunches()
    const updatedLaunches = [...baseLaunches]

    // Update launches that have pool addresses
    for (const launch of updatedLaunches) {
      const poolKey = launch.symbol.toLowerCase()
      const poolAddress = POOL_ADDRESSES[poolKey as keyof typeof POOL_ADDRESSES]

      if (poolAddress) {
        try {
          const geckoData = await fetchGeckoTerminalData(poolAddress)
          if (geckoData) {
            const launchIndex = updatedLaunches.findIndex(l => l.id === launch.id)
            if (launchIndex !== -1) {
              updatedLaunches[launchIndex] = updateLaunchWithGeckoData(launch, geckoData)
            }
          }
        } catch (error) {
          console.error(`Failed to update ${launch.symbol} with live data:`, error)
        }
      }
    }

    setLaunches(updatedLaunches)
    setIsUpdatingData(false)
  }

  // Fetch live data on component mount and set up refresh interval
  useEffect(() => {
    updateLaunchesWithLiveData()

    // Update every 30 seconds
    const interval = setInterval(updateLaunchesWithLiveData, 30000)

    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const filteredAndSortedLaunches = useMemo(() => {
    let filtered = launches

    // Search filter (name, symbol, contract address)
    if (searchTerm) {
      filtered = filtered.filter(launch =>
        launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.contract_address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Market cap filter
    if (mcapFilter !== 'all') {
      filtered = filtered.filter(launch => {
        const fdv = launch.fdv
        switch (mcapFilter) {
          case 'sub100k': return fdv < 100000
          case '100k-1m': return fdv >= 100000 && fdv < 1000000
          case '1m-10m': return fdv >= 1000000 && fdv < 10000000
          case 'over10m': return fdv >= 10000000
          default: return true
        }
      })
    }

    // Launch type filter
    if (launchFilter !== 'all') {
      filtered = filtered.filter(launch => {
        const launchDate = new Date(launch.launchDate)
        const now = new Date()
        const daysDiff = (now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24)

        switch (launchFilter) {
          case 'wtf-only': return launch.dev_buy && launch.dev_buy > 0
          case 'last7d': return daysDiff <= 7
          case 'last30d': return daysDiff <= 30
          default: return true
        }
      })
    }

    // Volume filter
    if (showOnlyWithVolume) {
      filtered = filtered.filter(launch => launch.volume24h && launch.volume24h > 0)
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'mcap':
          return b.fdv - a.fdv
        case 'volume':
          return (b.volume24h || 0) - (a.volume24h || 0)
        case 'presale':
          return (b.dev_buy || 0) - (a.dev_buy || 0)
        case 'change':
          return (b.priceChange24h || 0) - (a.priceChange24h || 0)
        case 'launched':
          return new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
        default:
          return 0
      }
    })

    return sorted
  }, [launches, searchTerm, sortBy, mcapFilter, launchFilter, showOnlyWithVolume])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toFixed(0)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }


  const getPriceChangeColor = (change?: number) => {
    if (!change) return 'text-gray-400'
    return change > 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <main className="flex-1 pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00]">
              WTF Ecosystem
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Explore all projects launched through the WTF fair presale platform
          </p>

          {/* Live data indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${isUpdatingData ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-sm text-gray-400">
              {isUpdatingData ? 'Updating live data...' : 'Live data • Updates every 30s'}
            </span>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">{launches.length}</div>
              <div className="text-sm text-gray-400">Total Launches</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(launches.reduce((sum, l) => sum + l.fdv, 0))}
              </div>
              <div className="text-sm text-gray-400">Total Market Cap</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">
                {launches.reduce((sum, l) => sum + (l.dev_buy || 0), 0).toFixed(1)} ETH
              </div>
              <div className="text-sm text-gray-400">Total Presale Raised</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">
                {launches.reduce((sum, l) => sum + (l.volume24h || 0), 0) > 0 ? formatCurrency(launches.reduce((sum, l) => sum + (l.volume24h || 0), 0)) : '$0'}
              </div>
              <div className="text-sm text-gray-400">Total Volume 24h</div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, symbol, or contract address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
              />
            </div>
          </div>


          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-400 text-sm flex items-center mr-4">Sort by:</span>
            {([
              { key: 'mcap', label: 'Market Cap' },
              { key: 'volume', label: '24h Volume' },
              { key: 'presale', label: 'Presale Amount' },
              { key: 'change', label: '24h Change' },
              { key: 'launched', label: 'Launch Date' }
            ] as { key: SortOption; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  sortBy === key
                    ? 'bg-[#FFE500]/20 text-[#FFE500] border border-[#FFE500]/30'
                    : 'bg-black/20 text-gray-300 border border-white/10 hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Launch Listings */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredAndSortedLaunches.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No projects found matching your criteria
            </div>
          ) : (
            filteredAndSortedLaunches.map((launch, index) => (
              <motion.div
                key={launch.id}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {/* Premium card with glass morphism */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-[1px]">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-black/90 via-black/80 to-gray-900/90 backdrop-blur-xl border border-white/10" />
                </div>

                <div className="relative p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Project Info */}
                    <div className="md:col-span-4 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {launch.isImageLogo ? (
                          <img
                            src={launch.logo}
                            alt={`${launch.name} logo`}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-[#FFE500]/20 to-[#FF8C00]/20 rounded-xl flex items-center justify-center text-xl">
                            {launch.logo}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {launch.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 font-mono">${launch.symbol}</span>
                          <button
                            onClick={() => copyToClipboard(launch.contract_address)}
                            className="text-xs text-gray-500 hover:text-[#FFE500] transition-colors duration-200 cursor-pointer font-mono"
                            title="Click to copy full address"
                          >
                            {launch.contract_address.slice(0, 6)}...{launch.contract_address.slice(-4)}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Market Cap */}
                    <div className="md:col-span-2 text-center">
                      <div className="text-lg font-semibold text-white">
                        {formatCurrency(launch.fdv)}
                      </div>
                      <div className="text-sm text-gray-400">Market Cap</div>
                    </div>

                    {/* 24h Change */}
                    <div className="md:col-span-2 text-center">
                      <div className={`text-lg font-semibold ${getPriceChangeColor(launch.priceChange24h)}`}>
                        {launch.priceChange24h !== null && launch.priceChange24h !== undefined ?
                          `${launch.priceChange24h > 0 ? '+' : ''}${Number(launch.priceChange24h).toFixed(1)}%` :
                          '—'
                        }
                      </div>
                      <div className="text-sm text-gray-400">24h Change</div>
                    </div>

                    {/* Volume */}
                    <div className="md:col-span-2 text-center">
                      <div className="text-lg font-semibold text-white">
                        {launch.volume24h ? formatCurrency(launch.volume24h) : '—'}
                      </div>
                      <div className="text-sm text-gray-400">24h Volume</div>
                    </div>

                    {/* Presale Amount */}
                    <div className="md:col-span-2 text-center">
                      <div className="text-lg font-semibold text-white">
                        {launch.dev_buy ? `${launch.dev_buy} ETH` : '—'}
                      </div>
                      <div className="text-sm text-gray-400">Presale Raised</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(launch.launchDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </main>
  )
}