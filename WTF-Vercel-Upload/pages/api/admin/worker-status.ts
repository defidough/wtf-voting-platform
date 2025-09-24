import type { NextApiRequest, NextApiResponse } from 'next'
import { monitoring } from '@/lib/monitoring'

interface WorkerStatusResponse {
  success: boolean
  data?: {
    worker: any
    monitoring: any
    alerts: any[]
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WorkerStatusResponse>
) {
  // Basic auth check (in production, use proper authentication)
  const authHeader = req.headers.authorization
  const expectedAuth = `Bearer ${process.env.ADMIN_API_KEY || 'admin-secret'}`

  if (!authHeader || authHeader !== expectedAuth) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    })
  }

  try {
    if (req.method === 'GET') {
      // Get worker status
      let workerStatus = {
        isRunning: false,
        startTime: null,
        uptime: 0,
        stats: { eventsProcessed: 0, errors: 0, lastProcessedBlock: '0', lastEventTime: null },
        trackedContracts: 0,
        trackerStats: { trackedContracts: 0, processedTransactions: 0, isProcessing: false },
        monitoring: { status: 'warning', issues: ['Worker not available - Supabase not configured'], metrics: {} },
        metrics: {}
      }

      try {
        const { MintWorker } = await import('@/lib/mint-worker')
        const worker = MintWorker.getInstance()
        workerStatus = worker.getStatus()
      } catch (error) {
        console.log('Worker not available:', error.message)
      }

      const healthStatus = monitoring.getHealthStatus()
      const alerts = monitoring.getAlerts(20)

      return res.status(200).json({
        success: true,
        data: {
          worker: workerStatus,
          monitoring: healthStatus,
          alerts
        }
      })

    } else if (req.method === 'POST') {
      // Control worker (start/stop/restart)
      const { action } = req.body

      if (action === 'reset_metrics') {
        monitoring.resetMetrics()
        monitoring.addAlert('info', 'Metrics reset via admin interface')

        return res.status(200).json({
          success: true,
          data: {
            worker: { message: 'Worker unavailable' },
            monitoring: monitoring.getHealthStatus(),
            alerts: monitoring.getAlerts(5)
          }
        })
      }

      try {
        const { MintWorker } = await import('@/lib/mint-worker')
        const worker = MintWorker.getInstance()

        switch (action) {
          case 'start':
            await worker.start()
            monitoring.addAlert('info', 'Worker started via admin interface')
            break
          case 'stop':
            worker.stop()
            monitoring.addAlert('info', 'Worker stopped via admin interface')
            break
          case 'restart':
            worker.stop()
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
            await worker.start()
            monitoring.addAlert('info', 'Worker restarted via admin interface')
            break
          default:
            return res.status(400).json({
              success: false,
              error: 'Invalid action. Use: start, stop, restart, reset_metrics'
            })
        }

        const status = worker.getStatus()
        return res.status(200).json({
          success: true,
          data: {
            worker: status,
            monitoring: monitoring.getHealthStatus(),
            alerts: monitoring.getAlerts(5)
          }
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Worker not available - check Supabase configuration'
        })
      }

    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }

  } catch (error: any) {
    console.error('Admin API error:', error)
    monitoring.recordError(error, 'admin_api')

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}