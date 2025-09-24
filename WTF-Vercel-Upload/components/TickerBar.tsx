import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getEcosystemLaunches } from '@/lib/mockData'
import { fetchGeckoTerminalData, updateLaunchWithGeckoData, POOL_ADDRESSES } from '@/lib/geckoTerminalAPI'

interface TokenData {
  mcap: number
  priceChange24h: number
}

interface PlatformData {
  tokensLaunched: number
  dailyXpEarned: number
  totalLaunches: number
  totalMarketCap: number
  totalPresaleRaised: number
  totalVolume24h: number
}

export default function TickerBar() {
  const [tokenData, setTokenData] = useState<TokenData>({ mcap: 4200000, priceChange24h: 12.5 })

  // Initialize with ecosystem data immediately
  const ecosystemLaunches = getEcosystemLaunches()
  const initialPlatformData = {
    tokensLaunched: 0,
    dailyXpEarned: 0,
    totalLaunches: ecosystemLaunches.length,
    totalMarketCap: ecosystemLaunches.reduce((sum, l) => sum + l.fdv, 0),
    totalPresaleRaised: ecosystemLaunches.reduce((sum, l) => sum + (l.dev_buy || 0), 0),
    totalVolume24h: ecosystemLaunches.reduce((sum, l) => sum + (l.volume24h || 0), 0)
  }

  const [platformData, setPlatformData] = useState<PlatformData>(initialPlatformData)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch token data from CoinGecko API
  const fetchTokenData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/what-the-firkin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
      )

      if (!response.ok) {
        throw new Error('Failed to fetch from CoinGecko')
      }

      const data = await response.json()

      const tokenData: TokenData = {
        mcap: data.market_data?.fully_diluted_valuation?.usd || 0,
        priceChange24h: data.market_data?.price_change_percentage_24h || 0
      }

      setTokenData(tokenData)
    } catch (error) {
      console.error('Failed to fetch token data:', error)
      // Use fallback data
      setTokenData({ mcap: 4200000, priceChange24h: 12.5 })
    }
  }

  // Fetch platform data with live updates
  const fetchPlatformData = async () => {
    try {
      const baseLaunches = getEcosystemLaunches()
      const updatedLaunches = [...baseLaunches]

      // Update launches that have pool addresses with live data
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
            console.error(`Failed to update ${launch.symbol} in ticker:`, error)
          }
        }
      }

      // Calculate ecosystem stats with live data
      const totalLaunches = updatedLaunches.length
      const totalMarketCap = updatedLaunches.reduce((sum, l) => sum + l.fdv, 0)
      const totalPresaleRaised = updatedLaunches.reduce((sum, l) => sum + (l.dev_buy || 0), 0)
      const totalVolume24h = updatedLaunches.reduce((sum, l) => sum + (l.volume24h || 0), 0)

      setPlatformData({
        tokensLaunched: 0, // Remove fake data
        dailyXpEarned: 0, // Remove fake data
        totalLaunches,
        totalMarketCap,
        totalPresaleRaised,
        totalVolume24h
      })
    } catch (error) {
      console.error('Failed to fetch platform data:', error)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchTokenData()
    fetchPlatformData()

    // Set up interval to refresh data every 20 seconds
    const interval = setInterval(() => {
      fetchTokenData()
      fetchPlatformData()
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  const formatMcap = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="h-8 bg-black/80 backdrop-blur-sm border-b border-gray-800/50 flex items-center">
        <div className="text-gray-400 text-sm px-4">Loading WTF stats...</div>
      </div>
    )
  }

  return (
    <div className="h-8 bg-black/80 backdrop-blur-sm border-b border-gray-800/50 overflow-hidden relative will-change-auto">
      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/80 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/80 to-transparent z-10" />

      {/* Scrolling content */}
      <motion.div
        className="flex items-center h-full whitespace-nowrap"
        animate={{
          x: ['100%', '-100%']
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          width: 'max-content',
          willChange: 'transform'
        }}
      >
        <div className="flex items-center space-x-4 text-sm font-medium pr-6">
          {/* WTF Logo & Token */}
          <div className="flex items-center space-x-2">
            <img
              src="/wtf-logo-trans.png"
              alt="WTF Logo"
              className="w-5 h-5 opacity-90"
            />
            <span className="text-[#FFE500] font-bold">$WTF?</span>
          </div>

          {/* Market Cap */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">MCAP:</span>
            <span className="text-white font-mono">{formatMcap(tokenData.mcap)}</span>
          </div>

          {/* 24h Change */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">24h:</span>
            <span
              className={`font-mono ${
                tokenData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatPercentage(tokenData.priceChange24h)}
            </span>
          </div>

          {/* Only show these if they have real data
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Tokens Launched:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatNumber(platformData.tokensLaunched)}</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Daily XP Earned:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatNumber(platformData.dailyXpEarned)}</span>
          </div>
          */}

          {/* Total Launches */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total Launches:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatNumber(platformData.totalLaunches)}</span>
          </div>

          {/* Total Market Cap */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total Market Cap:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatMcap(platformData.totalMarketCap)}</span>
          </div>

          {/* Total Presale Raised */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total Presale Raised:</span>
            <span className="text-[#FFE500] font-mono font-bold">{platformData.totalPresaleRaised.toFixed(1)} ETH</span>
          </div>

          {/* Total Volume 24h */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total Volume 24h:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatMcap(platformData.totalVolume24h)}</span>
          </div>

          {/* Duplicate content for seamless loop */}
          <div className="flex items-center space-x-2 ml-6">
            <img
              src="/wtf-logo-trans.png"
              alt="WTF Logo"
              className="w-5 h-5 opacity-90"
            />
            <span className="text-[#FFE500] font-bold">$WTF?</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-400">MCAP:</span>
            <span className="text-white font-mono">{formatMcap(tokenData.mcap)}</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-400">24h:</span>
            <span
              className={`font-mono ${
                tokenData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatPercentage(tokenData.priceChange24h)}
            </span>
          </div>

          {/* Only show these if they have real data
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Tokens Launched:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatNumber(platformData.tokensLaunched)}</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Daily XP Earned:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatNumber(platformData.dailyXpEarned)}</span>
          </div>
          */}

          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total Launches:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatNumber(platformData.totalLaunches)}</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total Market Cap:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatMcap(platformData.totalMarketCap)}</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total Presale Raised:</span>
            <span className="text-[#FFE500] font-mono font-bold">{platformData.totalPresaleRaised.toFixed(1)} ETH</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total Volume 24h:</span>
            <span className="text-[#FFE500] font-mono font-bold">{formatMcap(platformData.totalVolume24h)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}