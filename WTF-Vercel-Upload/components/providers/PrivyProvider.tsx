'use client'

import React from 'react'
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'

interface PrivyProviderProps {
  children: React.ReactNode
}

export default function PrivyProvider({ children }: PrivyProviderProps) {
  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clp4xz9yn00v4l90f8j23x4rj'}
      config={{
        // Customize Privy's appearance
        appearance: {
          theme: 'dark',
          accentColor: '#FFE500',
          logo: '/wtf-logo-trans.png',
          showWalletLoginFirst: true,
        },
        // Configure supported login methods
        loginMethods: ['wallet', 'email', 'google', 'twitter', 'discord'],
        // Enable embedded wallets for users who don't have one
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        // Configure external wallet connectors
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: 'smartWalletOnly',
          },
          metamask: true,
          walletConnect: {
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          },
        },
        // Configure supported chains (Base focus)
        supportedChains: [
          {
            id: 8453, // Base
            name: 'Base',
            network: 'base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://mainnet.base.org'],
              },
            },
            blockExplorers: {
              default: {
                name: 'BaseScan',
                url: 'https://basescan.org',
              },
            },
          },
          {
            id: 84532, // Base Sepolia (testnet)
            name: 'Base Sepolia',
            network: 'base-sepolia',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://sepolia.base.org'],
              },
            },
            blockExplorers: {
              default: {
                name: 'BaseScan Sepolia',
                url: 'https://sepolia.basescan.org',
              },
            },
          },
          {
            id: 1, // Ethereum mainnet (for ENS resolution)
            name: 'Ethereum',
            network: 'ethereum',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://eth.llamarpc.com'],
              },
            },
            blockExplorers: {
              default: {
                name: 'Etherscan',
                url: 'https://etherscan.io',
              },
            },
          },
        ],
        // Default chain
        defaultChain: {
          id: 8453, // Base
          name: 'Base',
          network: 'base',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: {
            default: {
              http: ['https://mainnet.base.org'],
            },
          },
          blockExplorers: {
            default: {
              name: 'BaseScan',
              url: 'https://basescan.org',
            },
          },
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}