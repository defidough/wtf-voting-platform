import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { WTF_HOLDER_TIERS, formatWTFBalance } from '@/lib/xpSystem'
import { TrophyIcon } from './icons/WTFIcons'

export default function GetWTFDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const contractAddress = '0x9A4D496A08b2df2b1b115d2cDF9c0a5629384b07'

  const officialLinks = [
    { name: 'DEX', url: 'https://dexscreener.com/base/0x4a66b258c6816eac87d87de9921037d298c44070' },
    { name: 'Clanker', url: 'https://www.clanker.world/clanker/0x9A4D496A08b2df2b1b115d2cDF9c0a5629384b07' },
    { name: 'Interface', url: 'https://app.interface.social/token/8453/0x9a4d496a08b2df2b1b115d2cdf9c0a5629384b07' },
    { name: 'Empire Builder', url: 'https://www.empirebuilder.world/empire/0x9A4D496A08b2df2b1b115d2cDF9c0a5629384b07' }
  ]

  const tokenomics = [
    { label: 'Total Supply', value: '100B' },
    { label: 'Public Presale', value: '$37,000' },
    { label: 'Presale Airdrop', value: '47B' },
    { label: 'Team Treasury', value: '10B' },
    { label: 'Development & Utility', value: '20B' },
    { label: 'Utility', value: 'XP, perks & governance' }
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* $WTF? Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="relative overflow-hidden bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] text-black font-bold px-8 py-3 rounded-full text-base transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(255,215,0,0.7)] border-2 border-[#FFD700]/80 group hover:border-[#FFD700] hover:scale-105"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(255,215,0,0.4)",
            "0 0 30px rgba(255,165,0,0.6)",
            "0 0 20px rgba(255,215,0,0.4)"
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Multiple shine effects for more premium look */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[250%] transition-transform duration-800" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-120%] group-hover:translate-x-[270%] transition-transform duration-1000 delay-100" />

        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-[#FFA500]/30 to-[#FFD700]/20 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="relative z-10 font-black tracking-wide text-shadow-sm">$WTF?</span>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Desktop Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-96 bg-black/80 backdrop-blur-md rounded-xl border border-gradient-to-r from-[#FFE500]/30 to-[#FF9900]/30 shadow-xl z-50 hidden md:block"
              onMouseLeave={() => setIsOpen(false)}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/20 via-[#FF9900]/20 to-[#FFE500]/20 p-[1px]">
                <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-md" />
              </div>

              <div className="relative p-6 space-y-6">
                {/* Header */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    $WTF? is the official token of the WTF app
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">CA:</span>
                    <code className="text-[#FFE500] font-mono text-xs break-all">
                      {contractAddress}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Copy address"
                    >
                      📋
                    </button>
                  </div>
                </div>

                {/* Official Links */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Official Links</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {officialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-center border border-gray-700/50 hover:border-[#FFE500]/30"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* WTF Holder Tiers */}
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <TrophyIcon size={18} />
                    WTF Holder Tiers
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {WTF_HOLDER_TIERS.map((tier) => (
                      <motion.div
                        key={tier.id}
                        className="relative group cursor-default"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Glowing gradient border */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FFE500]/20 via-[#FF8C00]/20 to-[#FFE500]/20 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-full h-full rounded-lg bg-gradient-to-br from-black/90 via-gray-900/90 to-purple-900/30" />
                        </div>

                        <div className="relative p-2 text-center">
                          <div className="text-xs font-bold text-white mb-1">
                            Tier {tier.id} — {tier.name}
                          </div>
                          <div className="text-xs text-[#FFE500] font-semibold mb-1">
                            {formatWTFBalance(tier.minBalance)}+ $WTF
                          </div>
                          <div className="text-xs text-blue-400">
                            +{tier.bonusVotes} votes
                          </div>
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FFE500]/10 via-[#FF8C00]/10 to-[#FFE500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </motion.div>
                    ))}
                  </div>
                  <Link href="/xp">
                    <span className="text-[#FFE500] hover:text-[#FF9900] text-sm font-medium transition-colors cursor-pointer mt-3 block">
                      View your tier & XP details →
                    </span>
                  </Link>
                </div>

                {/* Tokenomics */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Tokenomics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {tokenomics.map((item) => (
                      <motion.div
                        key={item.label}
                        className="relative group cursor-default"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Glowing gradient border */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FFE500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-full h-full rounded-xl bg-gradient-to-br from-black/90 via-gray-900/90 to-purple-900/30" />
                        </div>

                        <div className="relative p-3 text-center">
                          <div className="text-xs text-gray-400 font-medium mb-1">{item.label}</div>
                          <div className="text-sm font-bold text-[#FFE500]">{item.value}</div>
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/10 via-[#FF8C00]/10 to-[#FFE500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Sliding Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 md:hidden"
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">$WTF?</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      $WTF? is the official token of the WTF app
                    </h3>
                    <div className="bg-gray-800/50 rounded-xl p-3">
                      <div className="text-sm text-gray-400 mb-1">Contract Address:</div>
                      <div className="flex items-center gap-2">
                        <code className="text-[#FFE500] font-mono text-xs break-all flex-1">
                          {contractAddress}
                        </code>
                        <button
                          onClick={copyToClipboard}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Official Links */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Official Links</h4>
                    <div className="space-y-2">
                      {officialLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 border border-gray-700/50 hover:border-[#FFE500]/30"
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* WTF Holder Tiers */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <TrophyIcon size={18} />
                      WTF Holder Tiers
                    </h4>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {WTF_HOLDER_TIERS.map((tier) => (
                        <motion.div
                          key={tier.id}
                          className="relative group cursor-default"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Glowing gradient border */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/20 via-[#FF8C00]/20 to-[#FFE500]/20 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-black/90 via-gray-900/90 to-purple-900/30" />
                          </div>

                          <div className="relative p-3 flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold text-white mb-1">
                                Tier {tier.id} — {tier.name}
                              </div>
                              <div className="text-xs text-[#FFE500] font-semibold">
                                {formatWTFBalance(tier.minBalance)}+ $WTF
                              </div>
                            </div>
                            <div className="text-sm text-blue-400 font-semibold">
                              +{tier.bonusVotes} votes
                            </div>
                          </div>

                          {/* Hover glow effect */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/10 via-[#FF8C00]/10 to-[#FFE500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </motion.div>
                      ))}
                    </div>
                    <Link href="/xp">
                      <span
                        className="text-[#FFE500] hover:text-[#FF9900] font-medium transition-colors cursor-pointer mt-3 block"
                        onClick={() => setIsOpen(false)}
                      >
                        View your tier & XP details →
                      </span>
                    </Link>
                  </div>

                  {/* Tokenomics */}
                  <div>
                    <h4 className="text-white font-semibold mb-4">Tokenomics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {tokenomics.map((item) => (
                        <motion.div
                          key={item.label}
                          className="relative group cursor-default"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Glowing gradient border */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FFE500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-black/90 via-gray-900/90 to-purple-900/30" />
                          </div>

                          <div className="relative p-4 text-center">
                            <div className="text-xs text-gray-400 font-medium mb-2">{item.label}</div>
                            <div className="text-sm font-bold text-[#FFE500]">{item.value}</div>
                          </div>

                          {/* Hover glow effect */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/10 via-[#FF8C00]/10 to-[#FFE500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}