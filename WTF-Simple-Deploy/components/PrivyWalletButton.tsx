'use client'

import React, { useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { motion } from 'framer-motion'

export default function PrivyWalletButton() {
  const { login, logout, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const [showWalletMenu, setShowWalletMenu] = useState(false)

  // Get the first connected wallet
  const connectedWallet = wallets.find(wallet => wallet.walletClientType !== 'embedded') || wallets[0]

  // Close wallet menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowWalletMenu(false)
    if (showWalletMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showWalletMenu])

  // Get display name from user profile or wallet
  const getDisplayName = () => {
    if (user?.wallet?.address) {
      // Check for basename first (Base naming system)
      // For now, show formatted address - we'll add name resolution later
      const address = user.wallet.address
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    return ''
  }

  if (!authenticated) {
    return (
      <motion.button
        onClick={() => login()}
        className="px-6 py-2.5 bg-gradient-to-r from-[#FFE500] via-[#FF8C00] to-[#FF4500] text-black font-bold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,229,0,0.6)] transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Connect Wallet
      </motion.button>
    )
  }

  return (
    <div className="relative">
      {/* Wallet Button with Menu */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          setShowWalletMenu(!showWalletMenu)
        }}
        className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#FFE500]/20 via-[#FF8C00]/20 to-[#FF4500]/20 backdrop-blur-sm border border-[#FFE500]/30 rounded-lg text-white hover:bg-gradient-to-r hover:from-[#FFE500]/30 hover:via-[#FF8C00]/30 hover:to-[#FF4500]/30 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Authenticated indicator */}
        <div className="w-6 h-6 bg-gradient-to-r from-[#FFE500] via-[#FF8C00] to-[#FF4500] rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
        </div>

        {/* Display Name */}
        <span className="text-sm font-medium">
          {getDisplayName()}
        </span>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${showWalletMenu ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Dropdown Menu */}
      {showWalletMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full right-0 mt-2 w-48 bg-gray-800 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl z-50"
        >
          <div className="p-2 space-y-1">
            {/* Wallet Info */}
            {connectedWallet && (
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-600">
                {connectedWallet.walletClientType === 'metamask' ? 'MetaMask' :
                 connectedWallet.walletClientType === 'coinbase_wallet' ? 'Coinbase Wallet' :
                 connectedWallet.walletClientType}
              </div>
            )}

            {/* Copy Address */}
            <button
              onClick={() => {
                if (user?.wallet?.address) {
                  navigator.clipboard.writeText(user.wallet.address)
                }
                setShowWalletMenu(false)
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-200"
            >
              Copy Address
            </button>

            <hr className="border-gray-600" />

            {/* Sign Out */}
            <button
              onClick={() => {
                logout()
                setShowWalletMenu(false)
              }}
              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}