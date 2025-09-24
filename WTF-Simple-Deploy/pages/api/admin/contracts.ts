import type { NextApiRequest, NextApiResponse } from 'next'
import { monitoring } from '@/lib/monitoring'

interface TrackedContract {
  address: string
  name: string
  type: 'ERC721' | 'ERC1155'
  project_id: string
  is_active: boolean
  start_block?: string
}

interface ContractsResponse {
  success: boolean
  data?: TrackedContract[]
  error?: string
}

interface ContractRequest {
  address: string
  name: string
  type: 'ERC721' | 'ERC1155'
  project_id: string
  is_active: boolean
  start_block?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContractsResponse>
) {
  // Basic auth check
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
      // Get all contracts
      let contracts: TrackedContract[] = []
      try {
        const { ContractManager } = await import('@/lib/mint-tracker')
        contracts = ContractManager.getActiveContracts()
      } catch (error) {
        console.log('ContractManager not available:', error.message)
      }

      return res.status(200).json({
        success: true,
        data: contracts
      })

    } else if (req.method === 'POST') {
      // Add new contract
      return res.status(501).json({
        success: false,
        error: 'Contract management requires Supabase configuration'
      })

    } else if (req.method === 'DELETE') {
      // Remove contract
      return res.status(501).json({
        success: false,
        error: 'Contract management requires Supabase configuration'
      })

    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }

  } catch (error: any) {
    console.error('Contracts API error:', error)
    monitoring.recordError(error, 'contracts_api')

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}