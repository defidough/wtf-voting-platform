// GeckoTerminal API integration for real-time DEX data
export interface GeckoTerminalPoolData {
  price_change_percentage_24h: number
  volume_usd_24h: number
  market_cap_usd: number | null
  price_usd: number
  reserve_in_usd: number
}

export async function fetchGeckoTerminalData(poolAddress: string, network = 'base'): Promise<GeckoTerminalPoolData | null> {
  try {
    const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/${network}/pools/${poolAddress}`)

    if (!response.ok) {
      throw new Error(`GeckoTerminal API error: ${response.status}`)
    }

    const data = await response.json()
    const poolData = data.data?.attributes

    if (!poolData) {
      return null
    }

    return {
      price_change_percentage_24h: poolData.price_change_percentage?.h24 || 0,
      volume_usd_24h: parseFloat(poolData.volume_usd?.h24 || '0'),
      market_cap_usd: poolData.market_cap_usd ? parseFloat(poolData.market_cap_usd) : null,
      price_usd: parseFloat(poolData.base_token_price_usd || '0'),
      reserve_in_usd: parseFloat(poolData.reserve_in_usd || '0')
    }
  } catch (error) {
    console.error('Error fetching GeckoTerminal data:', error)
    return null
  }
}

// Helper function to update ecosystem launch data with GeckoTerminal data
export function updateLaunchWithGeckoData(launch: any, geckoData: GeckoTerminalPoolData) {
  return {
    ...launch,
    priceChange24h: geckoData.price_change_percentage_24h,
    volume24h: geckoData.volume_usd_24h,
    fdv: geckoData.market_cap_usd || geckoData.reserve_in_usd || launch.fdv,
    currentMcap: geckoData.market_cap_usd || geckoData.reserve_in_usd || launch.currentMcap
  }
}

// Pool addresses for existing tokens (when available)
export const POOL_ADDRESSES = {
  'wtf': '0x4a66b258c6816eac87d87de9921037d298c44070',
  'clanks': '0x8977a1a066f10dbb99132ef7b0ee42095d448bb0',
  'babydusk': '0x484a93295d0b44fb262b71f7b32b5b33ca133cb8ad36c37b8e5771f31aed07b7',
  // Add other pool addresses as they become available
}