import React from 'react'
import { motion } from 'framer-motion'
import PresaleCard from '@/components/PresaleCard'
import { getCurrentWinningProject } from '@/lib/mockData'

export default function Presale() {
  const winningProject = getCurrentWinningProject()
  const mockWallet = '0x1234567890abcdef1234567890abcdef12345678'

  return (
    <>
      <main className="flex-1 pt-32 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00]">Fair Launch Presale</span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Contribute to the community-voted winner. No snipers, just fair access for all.
            </motion.p>

            {/* XP Reward Card */}
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Glowing gradient border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px]">
                <div className="w-full h-full rounded-full bg-black/90 backdrop-blur-sm" />
              </div>

              <div className="relative flex items-center gap-2 px-8 py-4">
                <span className="font-body text-gray-300">Earn</span>
                <span className="font-display font-bold text-[#FFE500] text-xl">+1 XP</span>
                <span className="font-body text-gray-300">per NFT minted in WTF</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <PresaleCard project={winningProject} mockWallet={mockWallet} />
          </motion.div>
        </div>
      </main>
    </>
  )
}