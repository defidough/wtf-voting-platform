import { createPublicClient, http, parseEventLogs, getContract, type Address, type Log, parseAbi } from 'viem'
import { base } from 'viem/chains'

// RPC Configuration
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org'
const QUICKNODE_URL = process.env.QUICKNODE_URL
const ALCHEMY_URL = process.env.ALCHEMY_URL

// Use provider hierarchy: QuickNode > Alchemy > Public RPC
const getRpcUrl = () => {
  if (QUICKNODE_URL) return QUICKNODE_URL
  if (ALCHEMY_URL) return ALCHEMY_URL
  return BASE_RPC_URL
}

// Create Viem client for Base
export const publicClient = createPublicClient({
  chain: base,
  transport: http(getRpcUrl(), {
    retryCount: 3,
    retryDelay: 1000,
  })
})

// Standard ERC721/ERC1155 Transfer event signatures
export const TRANSFER_EVENT_SIGNATURES = {
  ERC721: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer(address,address,uint256)
  ERC1155_SINGLE: '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62', // TransferSingle(address,address,address,uint256,uint256)
  ERC1155_BATCH: '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb' // TransferBatch(address,address,address,uint256[],uint256[])
} as const

// Contract tracking configuration
export interface TrackedContract {
  address: Address
  name: string
  type: 'ERC721' | 'ERC1155'
  project_id: string
  start_block?: bigint
  is_active: boolean
  abi?: any[]
}

// Mint event data structure
export interface MintEvent {
  contract_address: Address
  to_address: Address
  token_id?: bigint
  amount: bigint
  tx_hash: string
  block_number: bigint
  log_index: number
  project_id: string
  event_type: 'ERC721' | 'ERC1155_SINGLE' | 'ERC1155_BATCH'
}

// Parse Transfer events to extract mint information
export function parseMintEvent(log: Log, contract: TrackedContract): MintEvent | null {
  try {
    // Check if this is a mint (from address is 0x0)
    const fromAddress = log.topics[1]
    if (!fromAddress || fromAddress !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return null // Not a mint event
    }

    const toAddress = log.topics[2] as Address
    if (!toAddress) return null

    // Clean the address (remove padding)
    const cleanToAddress = `0x${toAddress.slice(-40)}` as Address

    if (contract.type === 'ERC721') {
      const tokenId = log.topics[3] ? BigInt(log.topics[3]) : 0n
      return {
        contract_address: contract.address,
        to_address: cleanToAddress,
        token_id: tokenId,
        amount: 1n, // ERC721 always mints 1
        tx_hash: log.transactionHash!,
        block_number: log.blockNumber!,
        log_index: log.logIndex!,
        project_id: contract.project_id,
        event_type: 'ERC721'
      }
    } else if (contract.type === 'ERC1155') {
      // For ERC1155, we need to decode the data field
      // This is a simplified parser - in production, use proper ABI decoding
      const data = log.data
      if (log.topics[0] === TRANSFER_EVENT_SIGNATURES.ERC1155_SINGLE) {
        // TransferSingle event
        const tokenId = data.length >= 64 ? BigInt(`0x${data.slice(2, 66)}`) : 0n
        const amount = data.length >= 128 ? BigInt(`0x${data.slice(66, 130)}`) : 1n

        return {
          contract_address: contract.address,
          to_address: cleanToAddress,
          token_id: tokenId,
          amount: amount,
          tx_hash: log.transactionHash!,
          block_number: log.blockNumber!,
          log_index: log.logIndex!,
          project_id: contract.project_id,
          event_type: 'ERC1155_SINGLE'
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error parsing mint event:', error)
    return null
  }
}

// Get logs for tracked contracts
export async function getMintLogs(
  contracts: TrackedContract[],
  fromBlock: bigint,
  toBlock?: bigint
): Promise<MintEvent[]> {
  const allMintEvents: MintEvent[] = []

  for (const contract of contracts) {
    if (!contract.is_active) continue

    try {
      // Get Transfer events for this contract
      const logs = await publicClient.getLogs({
        address: contract.address,
        topics: [
          [
            TRANSFER_EVENT_SIGNATURES.ERC721,
            TRANSFER_EVENT_SIGNATURES.ERC1155_SINGLE,
            TRANSFER_EVENT_SIGNATURES.ERC1155_BATCH
          ],
          '0x0000000000000000000000000000000000000000000000000000000000000000' // from: 0x0 (mint)
        ],
        fromBlock: fromBlock,
        toBlock: toBlock || 'latest'
      })

      // Parse each log
      for (const log of logs) {
        const mintEvent = parseMintEvent(log, contract)
        if (mintEvent) {
          allMintEvents.push(mintEvent)
        }
      }
    } catch (error) {
      console.error(`Error fetching logs for contract ${contract.address}:`, error)
    }
  }

  return allMintEvents
}

// Verify transaction on chain
export async function verifyTransaction(txHash: string) {
  try {
    const [tx, receipt] = await Promise.all([
      publicClient.getTransaction({ hash: txHash as `0x${string}` }),
      publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` })
    ])

    return {
      transaction: tx,
      receipt: receipt,
      verified: receipt.status === 'success'
    }
  } catch (error) {
    console.error('Error verifying transaction:', error)
    return {
      transaction: null,
      receipt: null,
      verified: false
    }
  }
}

// Get current block number
export async function getCurrentBlockNumber(): Promise<bigint> {
  return await publicClient.getBlockNumber()
}

// Watch for new blocks and mint events
export function watchMintEvents(
  contracts: TrackedContract[],
  onMintEvent: (events: MintEvent[]) => void,
  onError?: (error: Error) => void
) {
  let lastProcessedBlock = 0n

  const processNewBlock = async () => {
    try {
      const currentBlock = await getCurrentBlockNumber()

      if (lastProcessedBlock === 0n) {
        lastProcessedBlock = currentBlock - 10n // Start from 10 blocks ago
      }

      if (currentBlock > lastProcessedBlock) {
        const mintEvents = await getMintLogs(contracts, lastProcessedBlock + 1n, currentBlock)

        if (mintEvents.length > 0) {
          onMintEvent(mintEvents)
        }

        lastProcessedBlock = currentBlock
      }
    } catch (error) {
      if (onError) {
        onError(error as Error)
      } else {
        console.error('Error watching mint events:', error)
      }
    }
  }

  // Poll every 12 seconds (Base block time)
  const interval = setInterval(processNewBlock, 12000)

  // Initial check
  processNewBlock()

  // Return cleanup function
  return () => clearInterval(interval)
}

// WTF Token Balance Functionality
// ================================

// WTF Token contract address on Base
export const WTF_TOKEN_ADDRESS = '0x9A4D496A08b2df2b1b115d2cDF9c0a5629384b07' as Address

// ERC-20 Token ABI
const erc20Abi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
])

// Create WTF token contract instance
const wtfTokenContract = getContract({
  address: WTF_TOKEN_ADDRESS,
  abi: erc20Abi,
  client: publicClient
})

/**
 * Fetch WTF token balance for a given wallet address
 * @param walletAddress - Ethereum address to check balance for
 * @returns Promise<number> - Token balance as a number (already adjusted for decimals)
 */
export async function fetchWTFBalance(walletAddress: string): Promise<number> {
  try {
    if (!walletAddress || walletAddress === '0x0' || walletAddress.length !== 42) {
      return 0
    }

    // Normalize address to lowercase
    const address = walletAddress.toLowerCase() as Address

    // Get balance and decimals in parallel
    const [balance, decimals] = await Promise.all([
      wtfTokenContract.read.balanceOf([address]),
      wtfTokenContract.read.decimals()
    ])

    // Convert from wei to token amount using decimals
    const divisor = BigInt(10) ** BigInt(decimals)
    const balanceFormatted = Number(balance) / Number(divisor)

    return balanceFormatted
  } catch (error) {
    console.error('Error fetching WTF balance for', walletAddress, ':', error)
    return 0
  }
}

/**
 * Batch fetch WTF token balances for multiple wallet addresses
 * @param walletAddresses - Array of Ethereum addresses
 * @returns Promise<Record<string, number>> - Map of address to balance
 */
export async function batchFetchWTFBalances(walletAddresses: string[]): Promise<Record<string, number>> {
  try {
    const validAddresses = walletAddresses.filter(addr =>
      addr && addr !== '0x0' && addr.length === 42
    )

    if (validAddresses.length === 0) {
      return {}
    }

    // Fetch all balances in parallel (with rate limiting)
    const batchSize = 10 // Limit concurrent requests
    const balanceMap: Record<string, number> = {}

    for (let i = 0; i < validAddresses.length; i += batchSize) {
      const batch = validAddresses.slice(i, i + batchSize)

      const balancePromises = batch.map(async (address) => {
        const balance = await fetchWTFBalance(address)
        return { address: address.toLowerCase(), balance }
      })

      const results = await Promise.allSettled(balancePromises)

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          balanceMap[result.value.address] = result.value.balance
        }
      })

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < validAddresses.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return balanceMap
  } catch (error) {
    console.error('Error batch fetching WTF balances:', error)
    return {}
  }
}

/**
 * Get WTF token metadata
 * @returns Promise<{name: string, symbol: string, decimals: number}> - Token metadata
 */
export async function getWTFTokenMetadata() {
  try {
    const [name, symbol, decimals] = await Promise.all([
      wtfTokenContract.read.name(),
      wtfTokenContract.read.symbol(),
      wtfTokenContract.read.decimals()
    ])

    return { name, symbol, decimals: Number(decimals) }
  } catch (error) {
    console.error('Error fetching WTF token metadata:', error)
    return { name: 'WTF', symbol: 'WTF', decimals: 18 }
  }
}

// WTF Impact Statistics
// ======================

// Known burn wallet addresses for $WTF
export const BURN_WALLET_ADDRESSES = [
  '0x0000000000000000000000000000000000000000' as Address, // Null address
  '0x000000000000000000000000000000000000dEaD' as Address, // Dead address
  // Add any other known burn addresses specific to WTF
]

/**
 * Get total WTF tokens burned (sent to burn addresses)
 * @returns Promise<number> - Total burned WTF tokens
 */
export async function getTotalWTFBurned(): Promise<number> {
  try {
    const burnBalances = await Promise.all(
      BURN_WALLET_ADDRESSES.map(address => fetchWTFBalance(address))
    )

    return burnBalances.reduce((total, balance) => total + balance, 0)
  } catch (error) {
    console.error('Error fetching burned WTF tokens:', error)
    return 4_800_000 // Fallback to current estimate
  }
}

/**
 * Get number of active WTF holders (wallets with > 10K WTF)
 * Note: This is a simplified approach. In production, you'd use indexed data or subgraphs
 * @returns Promise<number> - Number of active holders
 */
export async function getActiveWTFHolders(): Promise<number> {
  try {
    // This is a placeholder implementation.
    // In a real-world scenario, you would:
    // 1. Use The Graph Protocol or similar indexing service
    // 2. Query transfer events to build a holder list
    // 3. Filter by minimum balance requirements

    // For now, return a calculated estimate based on available data
    // You could also use APIs like Dexscreener, Etherscan, etc.
    return 12_300 // Current estimate - would be replaced with real query
  } catch (error) {
    console.error('Error fetching active WTF holders:', error)
    return 12_300 // Fallback
  }
}

/**
 * Get current ETH price in USD
 * @returns Promise<number> - ETH price in USD
 */
export async function getCurrentETHPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    return data.ethereum?.usd || 3000 // Fallback to $3000 if API fails
  } catch (error) {
    console.error('Error fetching ETH price:', error)
    return 3000 // Fallback price
  }
}

/**
 * Calculate total capital raised from presales
 * @param ethPriceUSD - Current ETH price in USD
 * @returns Promise<number> - Total capital raised in USD
 */
export async function calculateCapitalRaised(ethPriceUSD?: number): Promise<number> {
  try {
    if (!ethPriceUSD) {
      ethPriceUSD = await getCurrentETHPrice()
    }

    // Import here to avoid circular dependency
    const { getEcosystemLaunches } = await import('./mockData')
    const launches = getEcosystemLaunches()

    // Sum all presale amounts (dev_buy) and convert to USD
    const totalETH = launches.reduce((sum, launch) => {
      return sum + (launch.dev_buy || 0)
    }, 0)

    return totalETH * ethPriceUSD
  } catch (error) {
    console.error('Error calculating capital raised:', error)
    return 2_100_000 // Fallback to current estimate
  }
}

/**
 * Get total number of tokens launched
 * @returns number - Total tokens launched through WTF platform
 */
export function getTotalTokensLaunched(): number {
  try {
    // Import here to avoid circular dependency
    const { getEcosystemLaunches } = require('./mockData')
    const launches = getEcosystemLaunches()
    return launches.length
  } catch (error) {
    console.error('Error getting total tokens launched:', error)
    return 35 // Fallback
  }
}

// Environment validation
if (!BASE_RPC_URL && !QUICKNODE_URL && !ALCHEMY_URL) {
  console.warn('No RPC provider configured. Using default Base RPC.')
}

// Export configured client
export default publicClient