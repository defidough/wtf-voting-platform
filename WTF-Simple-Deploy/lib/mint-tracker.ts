import { MintService, XPService } from './supabase'
import { verifyTransaction, type MintEvent, type TrackedContract } from './blockchain'
import type { Database } from './supabase-types'

// Mint tracking service
export class MintTracker {
  private static instance: MintTracker
  private trackedContracts: Map<string, TrackedContract> = new Map()
  private processedTxHashes: Set<string> = new Set()
  private isProcessing = false

  private constructor() {}

  static getInstance(): MintTracker {
    if (!MintTracker.instance) {
      MintTracker.instance = new MintTracker()
    }
    return MintTracker.instance
  }

  // Add contract to tracking
  addContract(contract: TrackedContract) {
    this.trackedContracts.set(contract.address.toLowerCase(), contract)
    console.log(`Added contract ${contract.address} (${contract.name}) to tracking`)
  }

  // Remove contract from tracking
  removeContract(address: string) {
    this.trackedContracts.delete(address.toLowerCase())
    console.log(`Removed contract ${address} from tracking`)
  }

  // Get all tracked contracts
  getTrackedContracts(): TrackedContract[] {
    return Array.from(this.trackedContracts.values())
  }

  // Check if transaction was already processed
  private async isDuplicateTransaction(txHash: string): Promise<boolean> {
    // Check in-memory cache first
    if (this.processedTxHashes.has(txHash)) {
      return true
    }

    // Check database
    try {
      const { data } = await MintService.getMintByTxHash(txHash)
      if (data && data.length > 0) {
        this.processedTxHashes.add(txHash)
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking duplicate transaction:', error)
      return false
    }
  }

  // Process mint events
  async processMintEvents(events: MintEvent[]): Promise<void> {
    if (this.isProcessing) {
      console.log('Already processing mint events, skipping...')
      return
    }

    this.isProcessing = true

    try {
      console.log(`Processing ${events.length} mint events...`)

      for (const event of events) {
        await this.processSingleMintEvent(event)
      }

      console.log(`Successfully processed ${events.length} mint events`)
    } catch (error) {
      console.error('Error processing mint events:', error)
    } finally {
      this.isProcessing = false
    }
  }

  // Process a single mint event
  private async processSingleMintEvent(event: MintEvent): Promise<void> {
    try {
      // Check for duplicates
      if (await this.isDuplicateTransaction(event.tx_hash)) {
        console.log(`Skipping duplicate transaction: ${event.tx_hash}`)
        return
      }

      // Verify transaction on chain
      const verification = await verifyTransaction(event.tx_hash)
      if (!verification.verified) {
        console.warn(`Transaction ${event.tx_hash} failed verification`)
        return
      }

      const wallet = event.to_address.toLowerCase()
      const nftCount = Number(event.amount)

      console.log(`Processing mint: ${wallet} minted ${nftCount} NFTs in ${event.tx_hash}`)

      // Record the mint in database
      await MintService.recordMint(
        wallet,
        event.project_id,
        nftCount,
        event.tx_hash
      )

      // Mark as processed
      this.processedTxHashes.add(event.tx_hash)

      console.log(`✅ Successfully processed mint for ${wallet}: ${nftCount} NFTs, earned ${nftCount * 5} XP`)

    } catch (error) {
      console.error(`Error processing mint event ${event.tx_hash}:`, error)

      // If it's a duplicate error, mark as processed
      if (error.message?.includes('duplicate') || error.code === '23505') {
        this.processedTxHashes.add(event.tx_hash)
      }
    }
  }

  // Process webhook data
  async processWebhookMint(webhookData: {
    wallet: string
    nfts: number
    tx_hash: string
    project_id: string
    contract_address?: string
    block_number?: number
  }): Promise<{ success: boolean; message: string }> {
    try {
      const { wallet, nfts, tx_hash, project_id } = webhookData

      // Validate input
      if (!wallet || !nfts || !tx_hash || !project_id) {
        return { success: false, message: 'Missing required fields' }
      }

      if (nfts <= 0) {
        return { success: false, message: 'Invalid NFT count' }
      }

      // Check for duplicates
      if (await this.isDuplicateTransaction(tx_hash)) {
        return { success: false, message: 'Transaction already processed' }
      }

      // Verify transaction on chain
      const verification = await verifyTransaction(tx_hash)
      if (!verification.verified) {
        return { success: false, message: 'Transaction verification failed' }
      }

      // Record the mint
      await MintService.recordMint(
        wallet.toLowerCase(),
        project_id,
        nfts,
        tx_hash
      )

      // Mark as processed
      this.processedTxHashes.add(tx_hash)

      return {
        success: true,
        message: `Successfully processed mint: ${nfts} NFTs, earned ${nfts * 5} XP`
      }

    } catch (error) {
      console.error('Error processing webhook mint:', error)

      // Handle duplicate errors gracefully
      if (error.message?.includes('duplicate') || error.code === '23505') {
        this.processedTxHashes.add(webhookData.tx_hash)
        return { success: false, message: 'Transaction already processed' }
      }

      return { success: false, message: 'Internal server error' }
    }
  }

  // Get processing stats
  getStats() {
    return {
      trackedContracts: this.trackedContracts.size,
      processedTransactions: this.processedTxHashes.size,
      isProcessing: this.isProcessing
    }
  }

  // Clear processed cache (for memory management)
  clearProcessedCache(olderThanHours = 24) {
    // In a production environment, you'd want to persist this data
    // and clean based on actual timestamps
    if (this.processedTxHashes.size > 10000) {
      this.processedTxHashes.clear()
      console.log('Cleared processed transaction cache')
    }
  }
}

// Contract management for the tracker
export class ContractManager {
  private static contracts: TrackedContract[] = [
    // Example contracts - these would come from your database or config
    // {
    //   address: '0x1234...' as Address,
    //   name: 'WTF NFT Collection',
    //   type: 'ERC721',
    //   project_id: 'wtf-nft-project',
    //   is_active: true
    // }
  ]

  static addContract(contract: TrackedContract) {
    this.contracts.push(contract)
    MintTracker.getInstance().addContract(contract)
  }

  static removeContract(address: string) {
    this.contracts = this.contracts.filter(c =>
      c.address.toLowerCase() !== address.toLowerCase()
    )
    MintTracker.getInstance().removeContract(address)
  }

  static getActiveContracts(): TrackedContract[] {
    return this.contracts.filter(c => c.is_active)
  }

  static getContract(address: string): TrackedContract | undefined {
    return this.contracts.find(c =>
      c.address.toLowerCase() === address.toLowerCase()
    )
  }

  // Load contracts from database or environment
  static async loadContracts() {
    // This would typically load from your database
    // For now, using environment variables
    const contractsEnv = process.env.TRACKED_CONTRACTS
    if (contractsEnv) {
      try {
        const contracts: TrackedContract[] = JSON.parse(contractsEnv)
        contracts.forEach(contract => {
          this.addContract(contract)
        })
        console.log(`Loaded ${contracts.length} contracts from environment`)
      } catch (error) {
        console.error('Error parsing TRACKED_CONTRACTS:', error)
      }
    }
  }
}

// Extend MintService with additional methods
declare module './supabase' {
  namespace MintService {
    function getMintByTxHash(txHash: string): Promise<{ data: any[] | null; error: any }>
  }
}

// Add the missing method to MintService
const originalMintService = MintService as any
originalMintService.getMintByTxHash = async function(txHash: string) {
  try {
    const { supabase } = await import('./supabase')
    const { data, error } = await supabase
      .from('mints')
      .select('*')
      .eq('tx_hash', txHash)

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export default MintTracker