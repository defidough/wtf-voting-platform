import { useState, useCallback } from 'react'

export interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  wallet: string | null
  isLoading: boolean
  error: string | null
}

export interface SimpleAuthActions {
  authenticate: () => Promise<boolean>
  logout: () => void
  clearError: () => void
}

const STORAGE_KEY = 'wtf_auth_token'

export function useSimpleAuth(): [AuthState, SimpleAuthActions] {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    wallet: null,
    isLoading: false,
    error: null
  })

  const authenticate = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    // Mock authentication - just return success
    setState({
      isAuthenticated: true,
      accessToken: 'mock-token',
      wallet: '0x1234...5678',
      isLoading: false,
      error: null
    })

    return true
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({
      isAuthenticated: false,
      accessToken: null,
      wallet: null,
      isLoading: false,
      error: null
    })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return [
    state,
    {
      authenticate,
      logout,
      clearError
    }
  ]
}