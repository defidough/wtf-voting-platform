import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'

// Check if user is in Coinbase Wallet/Base App
export const isCoinbaseWallet = () => {
  if (typeof window === 'undefined') return false

  // Check for Coinbase Wallet user agent
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isCoinbaseApp = userAgent.includes('coinbase') || userAgent.includes('base')

  // Check for Coinbase Wallet injection
  const hasCoinbaseProvider = !!(window as any).ethereum?.isCoinbaseWallet || !!(window as any).coinbase

  return isCoinbaseApp || hasCoinbaseProvider
}

// getDefaultConfig automatically provides connectors for MetaMask, WalletConnect, and Coinbase Wallet

// Wagmi configuration with Base as default chain
export const config = getDefaultConfig({
  appName: 'WTF Token Launcher',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [base],
  ssr: true,
})

// Chain configuration
export const chains = [base]
export const defaultChain = base

// Utility functions
export const isCorrectChain = (chainId?: number) => {
  return chainId === base.id
}

export const switchToBase = async () => {
  if (typeof window === 'undefined' || !window.ethereum) return false

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${base.id.toString(16)}` }],
    })
    return true
  } catch (error: any) {
    // If chain doesn't exist, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${base.id.toString(16)}`,
            chainName: 'Base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        })
        return true
      } catch (addError) {
        console.error('Failed to add Base chain:', addError)
        return false
      }
    }
    console.error('Failed to switch to Base chain:', error)
    return false
  }
}

// Format wallet address for display
export const formatAddress = (address: string, chars = 4) => {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}