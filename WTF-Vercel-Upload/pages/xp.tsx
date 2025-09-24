import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { VotingIcon, PresaleIcon, BuilderIcon, TrophyIcon, StarIcon, XPIcon } from '@/components/icons/WTFIcons'
import { useXP } from '@/contexts/XPContext'
import { getNextTier, getTierProgress, formatWTFBalance, getWTFBalance, getWTFBalanceAsync, getUserTierAsync, getNextTierAsync, getTierProgressAsync } from '@/lib/xpSystem'
import { useAuth } from '@/contexts/AuthContext'
import type { WTFHolderTier } from '@/lib/xpSystem'

export default function XP() {
  const { getUserData, getUserTierData } = useXP()
  const { authState } = useAuth()

  // State for real-time balance data
  const [wtfBalance, setWtfBalance] = useState<number>(0)
  const [userTier, setUserTier] = useState<WTFHolderTier | null>(null)
  const [nextTier, setNextTier] = useState<WTFHolderTier | null>(null)
  const [tierProgress, setTierProgress] = useState<{ current: number, required: number, percentage: number }>({ current: 0, required: 0, percentage: 0 })
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  // Use connected wallet or fallback to mock wallet
  const walletAddress = authState.wallet || '0x1234567890abcdef1234567890abcdef12345678'
  const user = getUserData(walletAddress)
  const userTierFallback = getUserTierData(walletAddress)

  // Fetch real balance data when wallet is connected
  useEffect(() => {
    const fetchBalanceData = async () => {
      if (!walletAddress) return

      setIsLoadingBalance(true)
      try {
        // Use real blockchain data when wallet is connected, mock data otherwise
        const useRealData = !!authState.wallet && authState.isAuthenticated

        const [balance, tier, next, progress] = await Promise.all([
          getWTFBalanceAsync(walletAddress, useRealData),
          getUserTierAsync(walletAddress, useRealData),
          getNextTierAsync(walletAddress, useRealData),
          getTierProgressAsync(walletAddress, useRealData)
        ])

        setWtfBalance(balance)
        setUserTier(tier)
        setNextTier(next)
        setTierProgress(progress)
      } catch (error) {
        console.error('Error fetching balance data:', error)
        // Fallback to mock data
        setWtfBalance(getWTFBalance(walletAddress))
        setUserTier(userTierFallback)
        setNextTier(getNextTier(walletAddress))
        setTierProgress(getTierProgress(walletAddress))
      } finally {
        setIsLoadingBalance(false)
      }
    }

    fetchBalanceData()
  }, [walletAddress, authState.wallet, authState.isAuthenticated])

  const xpBreakdown = [
    {
      icon: <VotingIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Vote XP',
      description: '+1 XP for every vote cast in WTF.',
      amount: '+1 XP'
    },
    {
      icon: <PresaleIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Presale XP',
      description: '+1 XP per NFT minted in WTF presales.',
      amount: '+1 XP/NFT'
    },
    {
      icon: <BuilderIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Builder XP',
      description: '+10 XP for every project proposal submitted via WTF Builder.',
      amount: '+10 XP'
    },
    {
      icon: <TrophyIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Leaderboards',
      description: 'Track daily, weekly, monthly, and all-time XP rankings inside WTF.',
      amount: 'Rankings'
    },
    {
      icon: <StarIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Rewards',
      description: 'XP unlocks future perks, exclusive access, and airdrops — only for WTF participants.',
      amount: 'Perks'
    }
  ]

  const topEarners = [
    { wallet: '0x742d35Cc', xp: 2450, rank: 1 },
    { wallet: '0x8b9f12Ab', xp: 1890, rank: 2 },
    { wallet: '0xE45a89Cd', xp: 1650, rank: 3 },
    { wallet: '0x2c8f56Ef', xp: 1420, rank: 4 },
    { wallet: '0x9d4e7a12', xp: 1180, rank: 5 }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  return (
    <>
      {/* Hero Section */}
      <div className="pt-32 pb-8 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Earn XP — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-[#FF8C00] to-[#FF4500]">Participate To Win</span> on WTF
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Every vote, mint, and proposal inside WTF earns XP. Participation is power.
          </motion.p>
        </div>
      </div>

      {/* Your Tier Section */}
      {user && (
        <section className="relative z-10 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <XPIcon size={36} />
                Your WTF Status
              </h2>
              <p className="text-gray-400">Your current tier, XP, and progress</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Tier Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Glowing gradient border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] group-hover:from-[#FFE500]/50 group-hover:via-[#FF8C00]/50 group-hover:to-[#FF4500]/50 transition-all duration-300">
                  <div className="w-full h-full rounded-xl bg-black/95 backdrop-blur-sm" />
                </div>

                <div className="relative p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <TrophyIcon size={32} />
                    <h3 className="text-2xl font-bold text-white">Current Tier</h3>
                  </div>

                  {userTier ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-[#FFE500]">Tier {userTier.id}</div>
                        <div className="text-xl font-semibold text-white">— {userTier.name}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-gray-400">Balance:</div>
                        <div className="text-[#FFE500] font-bold">{formatWTFBalance(wtfBalance)} $WTF</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-gray-400">Bonus Votes:</div>
                        <div className="text-blue-400 font-bold">+{userTier.bonusVotes} daily votes</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-gray-400">Total XP:</div>
                        <div className="text-white font-bold">{user.totalXP.toLocaleString()} XP</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-gray-400">No tier qualified</div>
                      <div className="text-sm text-gray-500">
                        Hold {formatWTFBalance(1_000_000)} $WTF to unlock Supporter tier
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Progress to Next Tier Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Glowing gradient border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 p-[1px] group-hover:from-blue-500/50 group-hover:via-purple-500/50 group-hover:to-blue-500/50 transition-all duration-300">
                  <div className="w-full h-full rounded-xl bg-black/95 backdrop-blur-sm" />
                </div>

                <div className="relative p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <StarIcon size={32} />
                    <h3 className="text-2xl font-bold text-white">Progress</h3>
                  </div>

                  {nextTier ? (
                    <div className="space-y-4">
                      <div className="text-gray-400 text-sm">Next: Tier {nextTier.id} — {nextTier.name}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{tierProgress.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(100, tierProgress.percentage)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatWTFBalance(tierProgress.current)} / {formatWTFBalance(tierProgress.required)} $WTF needed
                        </div>
                      </div>
                      <div className="text-blue-400 text-sm font-semibold">
                        +{nextTier.bonusVotes} bonus votes when reached
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-[#FFE500] font-bold">🎉 Maximum Tier Reached!</div>
                      <div className="text-gray-400 text-sm">
                        You've achieved the highest WTF tier available
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* XP Breakdown Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How to Earn XP
            </h2>
            <p className="text-gray-400">Multiple ways to contribute and build your reputation</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {xpBreakdown.map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <div className="relative">
                  {/* Barrel wood grain texture overlay */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-8 bg-cover bg-center mix-blend-overlay"
                    style={{
                      backgroundImage: 'url(/barrel-bg.jpeg)',
                      filter: 'contrast(0.3) brightness(0.4)'
                    }}
                  />

                  {/* Glowing gradient border */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] group-hover:from-[#FFE500]/50 group-hover:via-[#FF8C00]/50 group-hover:to-[#FF4500]/50 transition-all duration-300">
                    <div className="w-full h-full rounded-xl bg-black/95 backdrop-blur-sm" />
                  </div>

                  {/* Card content */}
                  <div className="relative p-6 h-full">
                    {/* Glowing background effect on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFE500]/5 via-transparent to-[#FF8C00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="text-center relative z-10">
                      <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-3">
                        {item.description}
                      </p>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#FFE500]/20 to-[#FF8C00]/20 rounded-full border border-[#FFE500]/30">
                        <span className="text-[#FFE500] font-bold text-sm">{item.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Metrics/Impact Section */}
      <section className="relative z-10 py-16 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              XP Impact Across WTF
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFD700]/30 via-[#FFA500]/30 to-[#FF8C00]/30 p-[1px] group-hover:from-[#FFD700]/50 group-hover:via-[#FFA500]/50 group-hover:to-[#FF8C00]/50 transition-all duration-300">
                  <div className="w-full h-full rounded-xl bg-black/95 backdrop-blur-sm" />
                </div>
                <div className="relative p-8">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">47,890</div>
                  <div className="text-gray-400">Total XP Earned</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFD700]/30 via-[#FFA500]/30 to-[#FF8C00]/30 p-[1px] group-hover:from-[#FFD700]/50 group-hover:via-[#FFA500]/50 group-hover:to-[#FF8C00]/50 transition-all duration-300">
                  <div className="w-full h-full rounded-xl bg-black/95 backdrop-blur-sm" />
                </div>
                <div className="relative p-8">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">1,247</div>
                  <div className="text-gray-400">Active XP Earners</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFD700]/30 via-[#FFA500]/30 to-[#FF8C00]/30 p-[1px] group-hover:from-[#FFD700]/50 group-hover:via-[#FFA500]/50 group-hover:to-[#FF8C00]/50 transition-all duration-300">
                  <div className="w-full h-full rounded-xl bg-black/95 backdrop-blur-sm" />
                </div>
                <div className="relative p-8">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">89</div>
                  <div className="text-gray-400">Days of XP Activity</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Top XP Earners */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Top XP Earners</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {topEarners.map((earner, index) => (
                <div key={earner.wallet} className="flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-full px-4 py-3 border border-gray-700/50">
                  <span className="text-2xl">{earner.avatar}</span>
                  <span className="text-white font-mono">{earner.wallet}</span>
                  <span className="text-[#FFE500] font-bold">{earner.xp} XP</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="relative z-10">
        <div className="py-12 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="relative"
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 120,
                damping: 15
              }}
              viewport={{ once: true }}
            >
              <div className="relative backdrop-blur-xl bg-black/70 rounded-full p-8 shadow-2xl border-2 border-gray-600/30">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFE500]/40 via-blue-500/30 to-[#FF8C00]/40 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black/70 backdrop-blur-xl" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Start earning XP today — Join WTF and shape the future of fair launches.
                  </h3>
                  <motion.button
                    className="bg-gradient-to-r from-[#FFE500] to-[#FF8C00] text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 40px rgba(255, 229, 0, 0.6), 0 0 80px rgba(255, 140, 0, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Earning XP
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}