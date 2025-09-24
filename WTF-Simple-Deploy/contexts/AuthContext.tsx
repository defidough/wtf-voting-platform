import React, { createContext, useContext, ReactNode } from 'react'
import { useSimpleAuth, AuthState, SimpleAuthActions } from '@/hooks/useSimpleAuth'

interface AuthContextType {
  authState: AuthState
  authActions: SimpleAuthActions
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, authActions] = useSimpleAuth()

  return (
    <AuthContext.Provider value={{ authState, authActions }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hooks for specific auth state
export function useAuthState(): AuthState {
  const { authState } = useAuth()
  return authState
}

export function useAuthActions(): SimpleAuthActions {
  const { authActions } = useAuth()
  return authActions
}

// Helper hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
  const { authState } = useAuth()
  return authState.isAuthenticated
}

// Helper hook to get authenticated user wallet
export function useAuthenticatedWallet(): string | null {
  const { authState } = useAuth()
  return authState.isAuthenticated ? authState.wallet : null
}