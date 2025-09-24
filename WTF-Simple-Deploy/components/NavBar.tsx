import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Button from './Button'
import GetWTFDropdown from './GetWTFDropdown'
import SimpleWalletButton from './SimpleWalletButton'
import { useXP } from '@/contexts/XPContext'
import { XPIcon } from './icons/WTFIcons'

export default function NavBar() {
  const router = useRouter()
  const { getUserData, getUserTierData } = useXP()

  // Mock wallet for XP display (in practice this would come from wallet connection)
  const mockWallet = '0x1234567890abcdef1234567890abcdef12345678'
  const user = getUserData(mockWallet)
  const userTier = getUserTierData(mockWallet)
  const xpTotal = user?.totalXP || 0

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(path)
  }

  return (
    <nav className="fixed top-8 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <motion.img
                src="/wtf-logo-trans.png"
                alt="What The Firkin Logo"
                className="h-10 w-auto"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`relative transition-colors duration-200 ${
                  isActive('/')
                    ? 'text-[#FFE500] font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Home
                {isActive('/') && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFE500]"
                    layoutId="navbar-underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              <Link
                href="/voting"
                className={`relative transition-colors duration-200 ${
                  isActive('/voting')
                    ? 'text-[#FFE500] font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Voting
                {isActive('/voting') && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFE500]"
                    layoutId="navbar-underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              <Link
                href="/presale"
                className={`relative transition-colors duration-200 ${
                  isActive('/presale')
                    ? 'text-[#FFE500] font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Presale
                {isActive('/presale') && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFE500]"
                    layoutId="navbar-underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              <Link
                href="/builder"
                className={`relative transition-colors duration-200 ${
                  isActive('/builder')
                    ? 'text-[#FFE500] font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Builder
                {isActive('/builder') && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFE500]"
                    layoutId="navbar-underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              <Link
                href="/leaderboard"
                className={`relative transition-colors duration-200 ${
                  isActive('/leaderboard')
                    ? 'text-[#FFE500] font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Leaderboard
                {isActive('/leaderboard') && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFE500]"
                    layoutId="navbar-underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              <Link
                href="/xp"
                className={`relative transition-colors duration-200 ${
                  isActive('/xp')
                    ? 'text-[#FFE500] font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                XP
                {isActive('/xp') && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFE500]"
                    layoutId="navbar-underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              <Link
                href="/ecosystem"
                className={`relative transition-colors duration-200 ${
                  isActive('/ecosystem')
                    ? 'text-[#FFE500] font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Ecosystem
                {isActive('/ecosystem') && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFE500]"
                    layoutId="navbar-underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* XP Display */}
            <motion.div
              className="group relative flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-gray-700/50 hover:border-[#FFE500]/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <XPIcon className="drop-shadow-lg" size={18} />
              <span className="text-sm text-white">XP:</span>
              <span className="text-sm font-bold text-[#FFE500]">
                {xpTotal.toLocaleString()}
              </span>

              {/* Hover tooltip with tier info */}
              {userTier && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/95 border border-gray-700/50 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Tier {userTier.id}</span>
                    <span className="text-white font-semibold">— {userTier.name}</span>
                    <span className="text-blue-400">(+{userTier.bonusVotes} votes)</span>
                  </div>
                </div>
              )}
            </motion.div>

            <GetWTFDropdown />
            <SimpleWalletButton />
          </div>
        </div>
      </div>
    </nav>
  )
}