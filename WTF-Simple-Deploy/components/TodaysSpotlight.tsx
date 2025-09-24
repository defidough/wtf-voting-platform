import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getCurrentWinningProject } from '@/lib/mockData'
import { InfoIcon, ClockIcon, WarningIcon, CoinsIcon, RocketIcon } from './icons/WTFIcons'

export default function TodaysSpotlight() {
  const winningProject = getCurrentWinningProject()
  const [nftsMinted, setNftsMinted] = useState(147)
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 31
  })

  // Simulate presale status - set to false to test fallback state
  const [presaleIsLive, setPresaleIsLive] = useState(true)

  // Calculate ETH raised (0.005 ETH per NFT)
  const ethRaised = (nftsMinted * 0.005).toFixed(3)

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate NFT minting updates
  useEffect(() => {
    const mintTimer = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        setNftsMinted(prev => prev + Math.floor(Math.random() * 3) + 1)
      }
    }, 10000)

    return () => clearInterval(mintTimer)
  }, [])

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0')
  }

  return (
    <div>
      {/* Spotlight Card */}
      <motion.div
        className="relative w-full max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Premium glass morphism border with subtle glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-[1px]"
          animate={presaleIsLive ? {
            boxShadow: [
              "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05)",
              "0 8px 32px rgba(255, 229, 0, 0.15), 0 0 0 1px rgba(255, 229, 0, 0.1)",
              "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            ]
          } : {}}
          transition={{
            duration: 3,
            repeat: presaleIsLive ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-black/95 via-black/90 to-gray-900/95 backdrop-blur-xl border border-white/10" />
        </motion.div>

        <div className="relative p-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-[#FF8C00] to-[#FF4500]">
                Today's Spotlight
              </span>
            </h2>
          </div>

          {presaleIsLive ? (
            /* Luxury Minimalist Layout */
            <div className="max-w-4xl mx-auto">
              {/* Elegant Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-[#FFE500] rounded-full"></div>
                  <span className="text-sm font-medium text-[#FFE500] uppercase tracking-[0.2em]">Live Presale</span>
                </div>

                <div className="flex flex-col items-center gap-8 mb-8">
                  {/* Prominent Logo */}
                  <div className="relative">
                    {winningProject.isImageLogo ? (
                      <img
                        src={winningProject.logo}
                        alt={`${winningProject.name} logo`}
                        className="w-24 h-24 rounded-2xl object-cover shadow-2xl ring-1 ring-white/20"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-[#FFE500]/30 via-[#FF8C00]/20 to-[#FF4500]/10 rounded-2xl flex items-center justify-center text-4xl shadow-2xl ring-1 ring-white/20">
                        {winningProject.logo}
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="text-center">
                    <h3 className="text-3xl font-light text-white mb-2 tracking-tight">
                      {winningProject.name}
                    </h3>
                    <p className="text-xl text-[#FFE500] font-medium mb-4">
                      ${winningProject.ticker}
                    </p>

                    {winningProject.vaultedSupply !== undefined && winningProject.vaultedSupply > 0 && (
                      <div className="inline-flex items-center gap-3 px-6 py-3 border border-[#FFE500]/30 rounded-full bg-[#FFE500]/5">
                        <span className="text-[#FFE500] text-lg">🔐</span>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">
                            {winningProject.vaultedSupply}% Supply Vaulted
                          </div>
                          <div className="text-xs text-gray-400">
                            Locked for 30 days from TGE
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Clean Stats Grid */}
              <div className="grid grid-cols-3 gap-12 mb-12">
                <div className="text-center">
                  <motion.div
                    className="text-3xl font-light text-white mb-2"
                    key={nftsMinted}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {nftsMinted.toLocaleString()}
                  </motion.div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Participants</div>
                </div>

                <div className="text-center">
                  <motion.div
                    className="text-3xl font-light text-white mb-2"
                    key={ethRaised}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {ethRaised} ETH
                  </motion.div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Raised</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-light text-[#FFE500] mb-2">
                    {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Time Left</div>
                </div>
              </div>

              {/* Elegant CTA */}
              <div className="text-center">
                <Link href="/presale">
                  <motion.button
                    className="px-10 py-4 bg-[#FFE500] text-black font-medium rounded-full hover:bg-[#FF8C00] transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join Presale
                  </motion.button>
                </Link>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <a
                    href={winningProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                  >
                    {winningProject.url}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback State - No Live Presale */
            <div className="text-center py-12">
              <div className="flex items-center justify-center mb-6">
                <InfoIcon className="mr-4 drop-shadow-lg" size={48} />
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    No presale is live right now.
                  </h3>
                  <p className="font-body text-gray-300">
                    <span className="text-[#FFE500]">Check back tomorrow</span> for the next community-voted launch.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Builder Funnel CTA Strip */}
      <motion.div
        className="max-w-5xl mx-auto mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="relative group">
          {/* Glowing gradient border */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
          </div>

          <div className="relative p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left: Text Content */}
              <div className="flex items-center gap-4 text-center lg:text-left">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <RocketIcon
                    className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300"
                    size={40}
                  />
                </motion.div>
                <div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2">
                    Ready to Launch with <span className="text-[#FFE500]">WTF</span>?
                  </h3>
                  <p className="font-body text-sm text-gray-300 max-w-md mb-2">
                    Submit your proposal and join the next wave of fair presale token launches on Base.
                  </p>
                  <p className="font-body text-xs text-gray-400 max-w-md">
                    Earn 60% of fees in WETH • Get spotlight exposure • Powered by Clanker v4
                  </p>
                </div>
              </div>

              {/* Right: CTA Button */}
              <div className="flex-shrink-0">
                <Link href="/builder#builder-form">
                  <motion.button
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#FFE500] via-[#FF8C00] to-[#FF4500] text-black font-bold text-sm rounded-xl hover:shadow-[0_0_25px_rgba(255,229,0,0.6)] transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(255,229,0,0.3)",
                        "0 0 15px rgba(255,229,0,0.5)",
                        "0 0 0px rgba(255,229,0,0.3)"
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity
                      }
                    }}
                  >
                    <RocketIcon size={20} className="text-black" />
                    Submit Your Proposal
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </motion.div>

      {/* DYOR Disclaimer */}
      <motion.div
        className="flex items-center justify-center mt-8 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <WarningIcon className="mr-3 flex-shrink-0 drop-shadow-lg" size={20} />
        <p className="font-body text-sm text-gray-500 italic">
          WTF highlights community-voted projects via presales. Always DYOR before participating.
        </p>
      </motion.div>
    </div>
  )
}