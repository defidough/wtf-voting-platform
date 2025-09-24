import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CoinsIcon, RocketIcon, UsersIcon, FireIcon } from './icons/WTFIcons'
import {
  calculateCapitalRaised,
  getTotalTokensLaunched,
  getActiveWTFHolders,
  getTotalWTFBurned
} from '@/lib/blockchain'

interface StatData {
  icon: React.ReactNode
  label: string
  value: string
  targetNumber: number
  isLoading?: boolean
}

export default function StatsBand() {
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState<StatData[]>([
    {
      icon: <CoinsIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300" size={32} />,
      label: 'Capital Raised',
      value: '$2.1M+',
      targetNumber: 2100000,
      isLoading: true
    },
    {
      icon: <RocketIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300" size={32} />,
      label: 'Tokens Launched',
      value: '35+',
      targetNumber: 35,
      isLoading: true
    },
    {
      icon: <UsersIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300" size={32} />,
      label: 'Active Holders',
      value: '12,300+',
      targetNumber: 12300,
      isLoading: true
    },
    {
      icon: <FireIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300" size={32} />,
      label: 'WTF Burned',
      value: '4.8M',
      targetNumber: 4800000,
      isLoading: true
    }
  ])

  // Fetch real-time data
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch all data in parallel
        const [capitalRaised, tokensLaunched, activeHolders, wtfBurned] = await Promise.allSettled([
          calculateCapitalRaised(),
          Promise.resolve(getTotalTokensLaunched()),
          getActiveWTFHolders(),
          getTotalWTFBurned()
        ])

        // Update stats with real data
        setStats(prevStats => prevStats.map((stat, index) => {
          let newTargetNumber = stat.targetNumber
          let newValue = stat.value

          switch (index) {
            case 0: // Capital Raised
              if (capitalRaised.status === 'fulfilled') {
                newTargetNumber = Math.round(capitalRaised.value)
                newValue = formatCurrency(capitalRaised.value)
              }
              break
            case 1: // Tokens Launched
              if (tokensLaunched.status === 'fulfilled') {
                newTargetNumber = tokensLaunched.value
                newValue = `${tokensLaunched.value}+`
              }
              break
            case 2: // Active Holders
              if (activeHolders.status === 'fulfilled') {
                newTargetNumber = activeHolders.value
                newValue = `${(activeHolders.value / 1000).toFixed(1)}K+`
              }
              break
            case 3: // WTF Burned
              if (wtfBurned.status === 'fulfilled') {
                newTargetNumber = Math.round(wtfBurned.value)
                newValue = `${(wtfBurned.value / 1000000).toFixed(1)}M`
              }
              break
          }

          return {
            ...stat,
            targetNumber: newTargetNumber,
            value: newValue,
            isLoading: false
          }
        }))
      } catch (error) {
        console.error('Error fetching stats data:', error)
        // Remove loading state even if there's an error
        setStats(prevStats => prevStats.map(stat => ({ ...stat, isLoading: false })))
      }
    }

    fetchRealData()
    setIsVisible(true)

    // Refresh data every 5 minutes
    const interval = setInterval(fetchRealData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M+`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K+`
    }
    return `$${amount.toLocaleString()}+`
  }

  const formatNumber = (number: number, originalValue: string) => {
    if (originalValue.includes('M')) {
      return `${(number / 1000000).toFixed(1)}M${originalValue.includes('+') ? '+' : ''}`
    }
    if (originalValue.includes('K')) {
      return `${(number / 1000).toFixed(1)}K${originalValue.includes('+') ? '+' : ''}`
    }
    if (originalValue.includes('$')) {
      return formatCurrency(number)
    }
    return `${number.toLocaleString()}${originalValue.includes('+') ? '+' : ''}`
  }

  return (
    <section className="relative w-full bg-gradient-to-b from-gray-900 to-black py-16">
      {/* Faint barrel grain texture overlay */}
      <div
        className="absolute inset-0 opacity-3 bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage: 'url(/barrel-bg.jpeg)',
          filter: 'contrast(0.2) brightness(0.3)'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Title with Icon */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            WTF Impact So Far
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1
              }}
              viewport={{ once: true }}
            >
              {/* Enhanced gradient border card with glow */}
              <div className="relative group">
                {/* Glowing gradient border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFD700]/40 via-[#FFA500]/30 to-[#FF8C00]/40 p-[1px] group-hover:from-[#FFD700]/60 group-hover:via-[#FFA500]/50 group-hover:to-[#FF8C00]/60 transition-all duration-300">
                  <div className="w-full h-full rounded-xl bg-black/95 backdrop-blur-sm" />
                </div>

                {/* Card content */}
                <div className="relative p-6 h-full text-center">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FF8C00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <motion.div
                    className="mb-4 flex justify-center relative z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1 + 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                    viewport={{ once: true }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="font-mono text-2xl md:text-3xl font-bold text-white mb-2 relative z-10">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                      viewport={{ once: true }}
                    >
                      {stat.isLoading ? (
                        <span className="inline-block">
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-gray-400"
                          >
                            Loading...
                          </motion.span>
                        </span>
                      ) : (
                        isVisible && (
                          <span id={`stat-${index}`}>{stat.value}</span>
                        )
                      )}
                    </motion.span>
                  </div>
                  <motion.div
                    className="text-gray-400 text-sm font-medium relative z-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + 0.7
                    }}
                    viewport={{ once: true }}
                  >
                    {stat.label}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}