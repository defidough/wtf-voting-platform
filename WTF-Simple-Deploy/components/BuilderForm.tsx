import React, { useState, useEffect } from 'react'
import { addSubmittedProject } from '@/lib/mockData'
import { useXP } from '@/contexts/XPContext'
import { getWTFBalance, formatWTFBalance, getWTFBalanceAsync } from '@/lib/xpSystem'
import { useAuth } from '@/contexts/AuthContext'
import Button from './Button'
import XPToast from './XPToast'

interface BuilderFormProps {
  onSubmit?: () => void
}

export default function BuilderForm({ onSubmit }: BuilderFormProps) {
  const { awardBuilderXP } = useXP()
  const { authState } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    url: '',
    vaultedSupply: 0
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showXPToast, setShowXPToast] = useState(false)
  const [userWTFBalance, setUserWTFBalance] = useState<number>(0)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const walletAddress = authState.wallet || '0x1234567890abcdef1234567890abcdef12345678'
  const minRequiredBalance = 10_000_000 // 10M $WTF
  const hasMinBalance = userWTFBalance >= minRequiredBalance

  // Fetch real balance when component mounts or wallet changes
  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoadingBalance(true)
      try {
        const useRealData = !!authState.wallet && authState.isAuthenticated
        const balance = await getWTFBalanceAsync(walletAddress, useRealData)
        setUserWTFBalance(balance)
      } catch (error) {
        console.error('Error fetching balance:', error)
        setUserWTFBalance(getWTFBalance(walletAddress))
      } finally {
        setIsLoadingBalance(false)
      }
    }

    fetchBalance()
  }, [walletAddress, authState.wallet, authState.isAuthenticated])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.ticker || !formData.url) {
      alert('Please fill in all fields')
      return
    }

    if (!hasMinBalance) {
      alert(`You need at least ${formatWTFBalance(minRequiredBalance)} $WTF to submit a project proposal.`)
      return
    }

    const logo = logoPreview || '🚀' // Fallback to rocket emoji

    addSubmittedProject({
      name: formData.name,
      ticker: formData.ticker,
      url: formData.url,
      logo,
      isImageLogo: !!logoPreview,
      vaultedSupply: formData.vaultedSupply
    })

    // Award builder XP
    awardBuilderXP(walletAddress, 10)

    setIsSubmitted(true)
    setShowXPToast(true)
    setFormData({ name: '', ticker: '', url: '', vaultedSupply: 0 })
    setLogoFile(null)
    setLogoPreview(null)
    onSubmit?.()

    setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <div className="relative">
      {/* Glowing gradient border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/20 via-[#FF8C00]/20 to-[#FF4500]/20 p-[1px]">
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-black/95 via-gray-900/95 to-purple-900/30 backdrop-blur-sm" />
      </div>

      <div className="relative p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Submit Your Project</h2>

        {/* Balance Requirement Notice */}
        <div className={`mb-6 p-4 rounded-xl border ${
          hasMinBalance
            ? 'bg-green-900/30 border-green-500/50 text-green-400'
            : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{hasMinBalance ? '✅' : '⚠️'}</span>
            <div>
              <div className="font-semibold">
                {hasMinBalance ? 'Eligible to Submit' : 'Minimum Balance Required'}
              </div>
              <div className="text-sm opacity-90">
                Your balance: {formatWTFBalance(userWTFBalance)} $WTF
                {!hasMinBalance && (
                  <> (Need {formatWTFBalance(minRequiredBalance - userWTFBalance)} more)</>
                )}
              </div>
              <div className="text-xs opacity-75 mt-1">
                Minimum required: {formatWTFBalance(minRequiredBalance)} $WTF
              </div>
            </div>
          </div>
        </div>

        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-500 text-green-400 rounded">
            Project submitted successfully and will appear in the next voting round.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Token Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
              placeholder="e.g., DeFi Protocol"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ticker
            </label>
            <input
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
              placeholder="e.g., DFP"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
              placeholder="https://yourproject.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Vaulted Supply (Optional)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="30"
                value={formData.vaultedSupply}
                onChange={(e) => setFormData(prev => ({ ...prev, vaultedSupply: Number(e.target.value) }))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.vaultedSupply}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(30, Number(e.target.value)))
                    setFormData(prev => ({ ...prev, vaultedSupply: value }))
                  }}
                  className="w-16 px-2 py-1 bg-black/40 border border-gray-600 rounded-md text-center text-white focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
                />
                <span className="text-gray-300 text-sm">%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Percentage of supply locked for 30 days from TGE (Token Generation Event). Range: 0-30%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Logo Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-md text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#FFE500] file:text-black file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
            />
          {logoPreview && (
            <div className="mt-2">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-16 h-16 object-cover rounded-xl border"
              />
            </div>
          )}
          </div>

          <div className="pt-4">
            <Button
              variant="blue"
              className="w-full"
              disabled={!hasMinBalance}
            >
              {hasMinBalance ? 'Submit Project' : `Need ${formatWTFBalance(minRequiredBalance)} $WTF`}
            </Button>
          </div>
        </form>
      </div>

      <XPToast
        xpAmount={10}
        isVisible={showXPToast}
        onHide={() => setShowXPToast(false)}
      />
    </div>
  )
}