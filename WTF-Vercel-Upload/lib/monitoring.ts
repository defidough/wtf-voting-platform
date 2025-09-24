import { EventEmitter } from 'events'

// Monitoring service for mint worker
export class MonitoringService extends EventEmitter {
  private static instance: MonitoringService
  private metrics = {
    startTime: Date.now(),
    eventsProcessed: 0,
    errors: 0,
    lastError: null as Error | null,
    webhookRequests: 0,
    rpcCalls: 0,
    uptime: 0,
    blocksProcessed: 0,
    lastBlock: 0n,
    performance: {
      avgProcessingTime: 0,
      maxProcessingTime: 0,
      minProcessingTime: Infinity
    }
  }

  private alerts: Array<{
    timestamp: number
    level: 'info' | 'warning' | 'error' | 'critical'
    message: string
    details?: any
  }> = []

  private constructor() {
    super()
    this.startMetricsCollection()
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  // Record an event being processed
  recordEventProcessed(processingTime: number) {
    this.metrics.eventsProcessed++
    this.updatePerformanceMetrics(processingTime)
    this.emit('event_processed', { count: this.metrics.eventsProcessed, processingTime })
  }

  // Record an error
  recordError(error: Error, context?: string) {
    this.metrics.errors++
    this.metrics.lastError = error

    const alert = {
      timestamp: Date.now(),
      level: 'error' as const,
      message: `${context ? `[${context}] ` : ''}${error.message}`,
      details: { stack: error.stack, context }
    }

    this.alerts.push(alert)
    this.trimAlerts()

    this.emit('error_recorded', alert)

    // Check for critical error patterns
    this.checkErrorPatterns()
  }

  // Record webhook request
  recordWebhookRequest() {
    this.metrics.webhookRequests++
    this.emit('webhook_request', { total: this.metrics.webhookRequests })
  }

  // Record RPC call
  recordRpcCall() {
    this.metrics.rpcCalls++
    this.emit('rpc_call', { total: this.metrics.rpcCalls })
  }

  // Record block processed
  recordBlockProcessed(blockNumber: bigint) {
    this.metrics.blocksProcessed++
    this.metrics.lastBlock = blockNumber
    this.emit('block_processed', { blockNumber, total: this.metrics.blocksProcessed })
  }

  // Update performance metrics
  private updatePerformanceMetrics(processingTime: number) {
    const current = this.metrics.performance

    // Update average (exponential moving average)
    current.avgProcessingTime = current.avgProcessingTime === 0
      ? processingTime
      : (current.avgProcessingTime * 0.9) + (processingTime * 0.1)

    // Update max/min
    current.maxProcessingTime = Math.max(current.maxProcessingTime, processingTime)
    current.minProcessingTime = Math.min(current.minProcessingTime, processingTime)
  }

  // Check for error patterns that require attention
  private checkErrorPatterns() {
    const recentErrors = this.alerts
      .filter(alert => alert.level === 'error' && Date.now() - alert.timestamp < 300000) // 5 minutes
      .length

    if (recentErrors >= 5) {
      this.addAlert('critical', 'High error rate detected', {
        recentErrors,
        timeWindow: '5 minutes'
      })
    }

    // Check for specific error types
    const connectionErrors = this.alerts
      .filter(alert =>
        alert.level === 'error' &&
        Date.now() - alert.timestamp < 600000 && // 10 minutes
        (alert.message.includes('connection') || alert.message.includes('network'))
      ).length

    if (connectionErrors >= 3) {
      this.addAlert('warning', 'Network connectivity issues detected', {
        connectionErrors,
        suggestion: 'Check RPC provider status'
      })
    }
  }

  // Add alert
  addAlert(level: 'info' | 'warning' | 'error' | 'critical', message: string, details?: any) {
    const alert = {
      timestamp: Date.now(),
      level,
      message,
      details
    }

    this.alerts.push(alert)
    this.trimAlerts()
    this.emit('alert_added', alert)

    if (level === 'critical') {
      console.error('🚨 CRITICAL ALERT:', message, details)
    } else if (level === 'error') {
      console.error('❌ ERROR:', message, details)
    } else if (level === 'warning') {
      console.warn('⚠️ WARNING:', message, details)
    } else {
      console.log('ℹ️ INFO:', message, details)
    }
  }

  // Keep only last 100 alerts
  private trimAlerts() {
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100)
    }
  }

  // Start collecting uptime metrics
  private startMetricsCollection() {
    setInterval(() => {
      this.metrics.uptime = Date.now() - this.metrics.startTime
      this.emit('metrics_updated', this.getMetrics())
    }, 30000) // Update every 30 seconds
  }

  // Get current metrics
  getMetrics() {
    return {
      startTime: this.metrics.startTime,
      eventsProcessed: this.metrics.eventsProcessed,
      errors: this.metrics.errors,
      lastError: this.metrics.lastError ? this.metrics.lastError.message : null,
      webhookRequests: this.metrics.webhookRequests,
      rpcCalls: this.metrics.rpcCalls,
      blocksProcessed: this.metrics.blocksProcessed,
      lastBlock: this.metrics.lastBlock.toString(), // Convert BigInt to string
      performance: this.metrics.performance,
      uptime: Date.now() - this.metrics.startTime,
      errorRate: this.metrics.eventsProcessed > 0
        ? (this.metrics.errors / this.metrics.eventsProcessed * 100).toFixed(2) + '%'
        : '0%',
      avgEventsPerMinute: this.metrics.uptime > 0
        ? (this.metrics.eventsProcessed / (this.metrics.uptime / 60000)).toFixed(2)
        : '0'
    }
  }

  // Get recent alerts
  getAlerts(limit = 50) {
    return this.alerts.slice(-limit).reverse()
  }

  // Get health status
  getHealthStatus() {
    const metrics = this.getMetrics()
    const recentErrors = this.alerts
      .filter(alert => alert.level === 'error' && Date.now() - alert.timestamp < 300000)
      .length

    const criticalAlerts = this.alerts
      .filter(alert => alert.level === 'critical' && Date.now() - alert.timestamp < 600000)
      .length

    let status: 'healthy' | 'warning' | 'error' | 'critical' = 'healthy'
    let issues: string[] = []

    if (criticalAlerts > 0) {
      status = 'critical'
      issues.push(`${criticalAlerts} critical alerts in last 10 minutes`)
    } else if (recentErrors >= 5) {
      status = 'error'
      issues.push(`${recentErrors} errors in last 5 minutes`)
    } else if (recentErrors >= 2) {
      status = 'warning'
      issues.push(`${recentErrors} errors in last 5 minutes`)
    }

    // Check if worker hasn't processed events recently (if it should have)
    if (metrics.uptime > 300000 && metrics.eventsProcessed === 0) { // 5 minutes
      status = status === 'healthy' ? 'warning' : status
      issues.push('No events processed since startup')
    }

    return {
      status,
      issues,
      metrics,
      lastCheck: Date.now()
    }
  }

  // Reset metrics (for testing or maintenance)
  resetMetrics() {
    this.metrics = {
      startTime: Date.now(),
      eventsProcessed: 0,
      errors: 0,
      lastError: null,
      webhookRequests: 0,
      rpcCalls: 0,
      uptime: 0,
      blocksProcessed: 0,
      lastBlock: 0n,
      performance: {
        avgProcessingTime: 0,
        maxProcessingTime: 0,
        minProcessingTime: Infinity
      }
    }
    this.alerts = []
    this.addAlert('info', 'Metrics reset')
  }
}

// Global monitoring instance
export const monitoring = MonitoringService.getInstance()

// Helper function to time async operations
export async function timeOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = Date.now()
  try {
    const result = await operation()
    const duration = Date.now() - startTime
    monitoring.recordEventProcessed(duration)
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    monitoring.recordError(error as Error, operationName)
    throw error
  }
}

export default MonitoringService