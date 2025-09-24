import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WinningProject, incrementPresaleMints } from '@/lib/mockData'
import { useXP } from '@/contexts/XPContext'
import { CoinStackIcon, CalendarStackIcon, ShieldIcon } from './icons/WTFIcons'
import Button from './Button'
import XPToast from './XPToast'

interface PresaleCardProps {
  project: WinningProject
  mockWallet: string
}

export default function PresaleCard({ project, mockWallet }: PresaleCardProps) {
  const { awardPresaleXP } = useXP()
  const [currentMints, setCurrentMints] = useState(project.presaleMints)
  const [displayMints, setDisplayMints] = useState(project.presaleMints)
  const [timeLeft, setTimeLeft] = useState('')
  const [showXPToast, setShowXPToast] = useState(false)
  const [selectedMints, setSelectedMints] = useState(10)
  const [xpAmount, setXpAmount] = useState(10)
  const [justContributed, setJustContributed] = useState(false)

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now()
      const timeRemaining = project.endsAt - now

      if (timeRemaining <= 0) {
        setTimeLeft('Presale Ended')
        return
      }

      const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [project.endsAt])

  const handleSliderChange = (value: number) => {
    setSelectedMints(value)
  }

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    if (value >= 1) {
      setSelectedMints(value)
    }
  }

  const handleContribute = () => {
    const oldMints = currentMints
    const newMints = oldMints + selectedMints

    setCurrentMints(newMints)
    setJustContributed(true)
    setTimeout(() => setJustContributed(false), 1000)

    incrementPresaleMints(selectedMints)
    awardPresaleXP(mockWallet, selectedMints)

    setXpAmount(selectedMints)
    setShowXPToast(true)
  }

  useEffect(() => {
    if (currentMints !== displayMints) {
      const startValue = displayMints
      const endValue = currentMints
      const duration = 1000
      const startTime = Date.now()

      const updateCounter = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easedProgress = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress)

        setDisplayMints(currentValue)

        if (progress < 1) {
          requestAnimationFrame(updateCounter)
        }
      }

      requestAnimationFrame(updateCounter)
    }
  }, [currentMints, displayMints])

  const hideXPToast = () => {
    setShowXPToast(false)
  }

  const ethRaised = (displayMints * 0.005).toFixed(3)
  const isEnded = project.endsAt <= Date.now()

  return (
    <>
      <motion.div
        className="relative max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px]">
          <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
        </div>

        <div className="relative p-8">
          <div className="flex items-center mb-6">
            <div className="mr-6">
              {project.isImageLogo ? (
                <img
                  src={project.logo}
                  alt={`${project.name} logo`}
                  className="w-24 h-24 object-cover rounded-xl border-2 border-[#FFE500]/30 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-[#FFE500]/20 to-[#FF8C00]/20 rounded-xl border-2 border-[#FFE500]/30 flex items-center justify-center text-5xl">
                  {project.logo}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{project.name}</h2>
              <p className="text-xl text-gray-300">${project.ticker}</p>
            </div>
          </div>

          <div className="mb-6">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFE500] hover:text-[#FF8C00] underline text-lg transition-colors duration-200"
            >
              {project.url}
            </a>
          </div>

          {project.vaultedSupply !== undefined && project.vaultedSupply > 0 && (
            <div className="flex items-center gap-3 text-sm text-gray-300 mb-6 p-3 bg-black/40 rounded-lg border border-[#FFE500]/20">
              <span className="text-[#FFE500] text-lg">🔐</span>
              <div>
                <div className="font-semibold text-[#FFE500]">{project.vaultedSupply}% Vaulted Supply</div>
                <div className="text-xs text-gray-400">Locked for 30 days from TGE</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div className="text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <motion.div className="text-3xl font-bold text-[#FFE500]" animate={justContributed ? { scale: 1.2 } : {}} transition={{ duration: 0.5 }}>
                Ξ {ethRaised}
              </motion.div>
              <div className="text-sm text-gray-400">ETH Raised</div>
            </motion.div>
            <motion.div className="text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <motion.div className="text-3xl font-bold text-white" animate={justContributed ? { scale: 1.2 } : {}} transition={{ duration: 0.5 }}>
                {displayMints}
              </motion.div>
              <div className="text-sm text-gray-400">Total Mints</div>
            </motion.div>
            <motion.div className="text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <div className="text-3xl font-bold text-[#FF8C00] font-mono">{timeLeft}</div>
              <div className="text-sm text-gray-400">Time Remaining</div>
            </motion.div>
          </div>

          <div className="space-y-6">
            {!isEnded && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-300 min-w-[80px]">Mints:</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={Math.min(selectedMints, 100)}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="number"
                    min="1"
                    value={selectedMints}
                    onChange={handleNumericInputChange}
                    className="w-20 px-3 py-2 bg-black/40 border border-gray-600 rounded-md text-center text-white focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
                  />
                </div>
                <div className="text-center text-sm text-gray-300">
                  <p>Cost: Ξ {(selectedMints * 0.005).toFixed(3)} ETH</p>
                  <p>XP Reward: <span className="text-[#FFE500]">+{selectedMints} XP</span></p>
                </div>
              </div>
            )}

            <div className="text-center">
              <Button variant="yellow" onClick={handleContribute} className="text-lg px-8 py-4">
                {isEnded ? 'Presale Ended' : `Contribute (${selectedMints} Mints)`}
              </Button>
            </div>
          </div>

          <motion.div className="mt-8 space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">How It Works</h3>
              <p className="text-gray-400">Fair launch mechanics designed to prevent extraction</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group cursor-default">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>
                <div className="relative p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <CoinStackIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300" size={48} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3">Funds → Dev Buy</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-[#FFE500] font-semibold">100%</span> of mint funds are used to dev buy the token at <span className="text-[#FFE500] font-semibold">TGE</span> (Token Generation Event).
                  </p>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              <div className="relative group cursor-default">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>
                <div className="relative p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <CalendarStackIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300" size={48} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3">4 Stage Airdrops</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Your presale tokens are distributed in <span className="text-[#FFE500] font-semibold">4 drops of 25%</span> each, smoothing out sell pressure.
                  </p>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              <div className="relative group cursor-default">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>
                <div className="relative p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <ShieldIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300" size={48} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3">Anti-Jeet Mechanics</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Selling or transferring more than <span className="text-[#FFE500] font-semibold">50%</span> of your allocation in any stage forfeits all remaining airdrops. Forfeited tokens are redistributed among wallets that hold <span className="text-[#FFE500] font-semibold">50%+</span> through all stages.
                  </p>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <XPToast xpAmount={xpAmount} isVisible={showXPToast} onHide={hideXPToast} />
    </>
  )
}