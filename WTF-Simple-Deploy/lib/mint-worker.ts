import { MintTracker, ContractManager } from './mint-tracker'
import { watchMintEvents, getCurrentBlockNumber } from './blockchain'
import { monitoring, timeOperation } from './monitoring'
import type { MintEvent } from './blockchain'

// Background worker for monitoring mint events
export class MintWorker {
  private static instance: MintWorker
  private isRunning = false
  private cleanupFunction: (() => void) | null = null
  private startTime: Date | null = null
  private stats = {
    eventsProcessed: 0,
    errors: 0,
    lastProcessedBlock: 0n,
    lastEventTime: null as Date | null
  }

  private constructor() {}

  static getInstance(): MintWorker {
    if (!MintWorker.instance) {
      MintWorker.instance = new MintWorker()
    }
    return MintWorker.instance
  }

  // Start the worker
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Mint worker is already running')
      return
    }

    try {
      console.log('🚀 Starting mint worker...')

      // Load contracts from configuration
      await ContractManager.loadContracts()

      const contracts = ContractManager.getActiveContracts()
      if (contracts.length === 0) {
        console.warn('⚠️ No active contracts to track. Worker will not monitor events.')
        return
      }

      console.log(`📋 Loaded ${contracts.length} contracts for tracking:`)
      contracts.forEach(contract => {
        console.log(`  - ${contract.name} (${contract.address}) - ${contract.type}`)
      })

      // Get current block for initial reference
      this.stats.lastProcessedBlock = await getCurrentBlockNumber()
      console.log(`📦 Current block: ${this.stats.lastProcessedBlock}`)

      // Set up event monitoring
      this.cleanupFunction = watchMintEvents(
        contracts,
        this.handleMintEvents.bind(this),
        this.handleError.bind(this)
      )

      this.isRunning = true
      this.startTime = new Date()

      console.log('✅ Mint worker started successfully')

      // Set up periodic cleanup
      this.setupPeriodicCleanup()

    } catch (error) {
      console.error('❌ Failed to start mint worker:', error)
      this.isRunning = false
      throw error
    }
  }

  // Stop the worker
  stop(): void {
    if (!this.isRunning) {
      console.log('Mint worker is not running')
      return
    }

    console.log('🛑 Stopping mint worker...')

    if (this.cleanupFunction) {
      this.cleanupFunction()
      this.cleanupFunction = null
    }

    this.isRunning = false
    console.log('✅ Mint worker stopped')
  }

  // Handle mint events
  private async handleMintEvents(events: MintEvent[]): Promise<void> {
    try {
      console.log(`🔍 Found ${events.length} mint events`)

      if (events.length > 0) {
        const result = await timeOperation(async () => {
          const tracker = MintTracker.getInstance()
          await tracker.processMintEvents(events)
          return events.length
        }, 'mint_events_processing')

        this.stats.eventsProcessed += events.length
        this.stats.lastEventTime = new Date()

        // Update last processed block
        const maxBlock = events.reduce((max, event) =>
          event.block_number > max ? event.block_number : max, 0n
        )
        if (maxBlock > this.stats.lastProcessedBlock) {
          this.stats.lastProcessedBlock = maxBlock
          monitoring.recordBlockProcessed(maxBlock)
        }

        monitoring.addAlert('info', `Processed ${events.length} mint events`, {
          blockRange: `${this.stats.lastProcessedBlock - BigInt(events.length)} - ${maxBlock}`,
          eventsCount: events.length
        })

        console.log(`✅ Processed ${events.length} mint events`)
      }

    } catch (error) {
      console.error('❌ Error handling mint events:', error)
      this.stats.errors++
      monitoring.recordError(error as Error, 'mint_events_handling')
    }
  }

  // Handle errors
  private handleError(error: Error): void {
    console.error('❌ Mint worker error:', error)
    this.stats.errors++
    monitoring.recordError(error, 'mint_worker')

    // Implement error recovery logic here
    if (error.message.includes('connection') || error.message.includes('network')) {
      console.log('🔄 Network error detected, will retry on next poll...')
      monitoring.addAlert('warning', 'Network error detected', {
        error: error.message,
        recovery: 'Will retry on next poll'
      })
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      monitoring.addAlert('warning', 'Rate limit exceeded', {
        error: error.message,
        recovery: 'Backing off for next requests'
      })
    } else {
      monitoring.addAlert('error', 'Unexpected worker error', {
        error: error.message,
        stack: error.stack
      })
    }
  }

  // Set up periodic cleanup
  private setupPeriodicCleanup(): void {
    // Clean up processed transaction cache every hour
    setInterval(() => {
      try {
        const tracker = MintTracker.getInstance()
        tracker.clearProcessedCache(24) // Clear cache older than 24 hours
        console.log('🧹 Performed periodic cleanup')
      } catch (error) {
        console.error('Error during periodic cleanup:', error)
      }
    }, 60 * 60 * 1000) // 1 hour
  }

  // Get worker status
  getStatus() {
    return {
      isRunning: this.isRunning,
      startTime: this.startTime,
      uptime: this.startTime ? Date.now() - this.startTime.getTime() : 0,
      stats: {
        ...this.stats,
        lastProcessedBlock: this.stats.lastProcessedBlock.toString()
      },
      trackedContracts: ContractManager.getActiveContracts().length,
      trackerStats: MintTracker.getInstance().getStats(),
      monitoring: monitoring.getHealthStatus(),
      metrics: monitoring.getMetrics()
    }
  }

  // Get detailed stats
  getDetailedStats() {
    const status = this.getStatus()
    const contracts = ContractManager.getActiveContracts()

    return {
      ...status,
      contracts: contracts.map(contract => ({
        address: contract.address,
        name: contract.name,
        type: contract.type,
        project_id: contract.project_id,
        is_active: contract.is_active
      })),
      performance: {
        eventsPerHour: status.uptime > 0 ?
          (this.stats.eventsProcessed / (status.uptime / (1000 * 60 * 60))).toFixed(2) : '0',
        errorRate: this.stats.eventsProcessed > 0 ?
          ((this.stats.errors / this.stats.eventsProcessed) * 100).toFixed(2) + '%' : '0%',
        lastEventAge: this.stats.lastEventTime ?
          Date.now() - this.stats.lastEventTime.getTime() : null
      }
    }
  }

  // Force process recent blocks (for testing or recovery)
  async forceProcessRecentBlocks(blockCount = 10): Promise<void> {
    try {
      console.log(`🔧 Force processing last ${blockCount} blocks...`)

      const contracts = ContractManager.getActiveContracts()
      if (contracts.length === 0) {
        console.log('No active contracts to process')
        return
      }

      const currentBlock = await getCurrentBlockNumber()
      const fromBlock = currentBlock - BigInt(blockCount)

      const { getMintLogs } = await import('./blockchain')
      const events = await getMintLogs(contracts, fromBlock, currentBlock)

      if (events.length > 0) {
        await this.handleMintEvents(events)
        console.log(`✅ Force processed ${events.length} events from blocks ${fromBlock} to ${currentBlock}`)
      } else {
        console.log(`No mint events found in blocks ${fromBlock} to ${currentBlock}`)
      }

    } catch (error) {
      console.error('Error force processing blocks:', error)
      throw error
    }
  }
}

// Auto-start the worker in production
if (process.env.NODE_ENV === 'production' && process.env.AUTO_START_MINT_WORKER === 'true') {
  console.log('🚀 Auto-starting mint worker in production mode...')

  // Start with a small delay to ensure everything is initialized
  setTimeout(async () => {
    try {
      await MintWorker.getInstance().start()
    } catch (error) {
      console.error('Failed to auto-start mint worker:', error)
    }
  }, 5000)
}

// Graceful shutdown handling
if (typeof process !== 'undefined') {
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down mint worker...')
    MintWorker.getInstance().stop()
  })

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down mint worker...')
    MintWorker.getInstance().stop()
  })
}

export default MintWorker