import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { getUserByWallet, getUserTier, awardXP as originalAwardXP, awardPresaleXP as originalAwardPresaleXP, awardBuilderXP as originalAwardBuilderXP } from '@/lib/xpSystem'

interface XPContextType {
  refreshXP: () => void
  awardXP: (wallet: string, amount: number) => void
  awardPresaleXP: (wallet: string, amount: number) => void
  awardBuilderXP: (wallet: string, amount: number) => void
  getUserData: (wallet: string) => ReturnType<typeof getUserByWallet>
  getUserTierData: (wallet: string) => ReturnType<typeof getUserTier>
}

const XPContext = createContext<XPContextType | undefined>(undefined)

export const useXP = () => {
  const context = useContext(XPContext)
  if (!context) {
    throw new Error('useXP must be used within an XPProvider')
  }
  return context
}

interface XPProviderProps {
  children: ReactNode
}

export const XPProvider: React.FC<XPProviderProps> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshXP = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  const awardXP = useCallback((wallet: string, amount: number) => {
    originalAwardXP(wallet, amount)
    refreshXP()
  }, [refreshXP])

  const awardPresaleXP = useCallback((wallet: string, amount: number) => {
    originalAwardPresaleXP(wallet, amount)
    refreshXP()
  }, [refreshXP])

  const awardBuilderXP = useCallback((wallet: string, amount: number) => {
    originalAwardBuilderXP(wallet, amount)
    refreshXP()
  }, [refreshXP])

  const getUserData = useCallback((wallet: string) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return getUserByWallet(wallet)
  }, [refreshTrigger])

  const getUserTierData = useCallback((wallet: string) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return getUserTier(wallet)
  }, [refreshTrigger])

  const value: XPContextType = {
    refreshXP,
    awardXP,
    awardPresaleXP,
    awardBuilderXP,
    getUserData,
    getUserTierData
  }

  return (
    <XPContext.Provider value={value}>
      {children}
    </XPContext.Provider>
  )
}