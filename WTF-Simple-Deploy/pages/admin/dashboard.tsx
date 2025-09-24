import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

interface WorkerStatus {
  isRunning: boolean
  startTime: string | null
  uptime: number
  stats: {
    eventsProcessed: number
    errors: number
    lastProcessedBlock: string
    lastEventTime: string | null
  }
  monitoring: {
    status: 'healthy' | 'warning' | 'error' | 'critical'
    issues: string[]
    metrics: any
  }
}

interface Contract {
  address: string
  name: string
  type: 'ERC721' | 'ERC1155'
  project_id: string
  is_active: boolean
}

interface Alert {
  timestamp: number
  level: 'info' | 'warning' | 'error' | 'critical'
  message: string
  details?: any
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<WorkerStatus | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [authenticatedApiKey, setAuthenticatedApiKey] = useState('')

  // New contract form
  const [newContract, setNewContract] = useState({
    address: '',
    name: '',
    type: 'ERC721' as 'ERC721' | 'ERC1155',
    project_id: '',
    is_active: true
  })

  const handleAuthenticate = () => {
    setAuthenticatedApiKey(apiKey)
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAuthenticate()
    }
  }

  const fetchData = async () => {
    if (!authenticatedApiKey) return

    try {
      const [statusRes, contractsRes] = await Promise.all([
        fetch('/api/admin/worker-status', {
          headers: { Authorization: `Bearer ${authenticatedApiKey}` }
        }),
        fetch('/api/admin/contracts', {
          headers: { Authorization: `Bearer ${authenticatedApiKey}` }
        })
      ])

      if (!statusRes.ok || !contractsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const statusData = await statusRes.json()
      const contractsData = await contractsRes.json()

      if (statusData.success) {
        setStatus(statusData.data.worker)
        setAlerts(statusData.data.alerts)
      }

      if (contractsData.success) {
        setContracts(contractsData.data)
      }

      setError(null)
    } catch (err) {
      setError('Failed to fetch data. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticatedApiKey) {
      fetchData()
      const interval = setInterval(fetchData, 10000) // Refresh every 10 seconds
      return () => clearInterval(interval)
    }
  }, [authenticatedApiKey])

  const controlWorker = async (action: string) => {
    if (!authenticatedApiKey) return

    try {
      const res = await fetch('/api/admin/worker-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedApiKey}`
        },
        body: JSON.stringify({ action })
      })

      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      setError('Failed to control worker')
    }
  }

  const addContract = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authenticatedApiKey) return

    try {
      const res = await fetch('/api/admin/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedApiKey}`
        },
        body: JSON.stringify(newContract)
      })

      if (res.ok) {
        setNewContract({
          address: '',
          name: '',
          type: 'ERC721',
          project_id: '',
          is_active: true
        })
        fetchData()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to add contract')
      }
    } catch (err) {
      setError('Failed to add contract')
    }
  }

  const removeContract = async (address: string) => {
    if (!authenticatedApiKey || !confirm('Are you sure you want to remove this contract?')) return

    try {
      const res = await fetch(`/api/admin/contracts?address=${address}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authenticatedApiKey}` }
      })

      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      setError('Failed to remove contract')
    }
  }

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m ${seconds % 60}s`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      case 'critical': return 'text-red-800'
      default: return 'text-gray-600'
    }
  }

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'critical': return 'bg-red-200 text-red-900'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!authenticatedApiKey) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin API key (press Enter or click below)"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAuthenticate}
            disabled={!apiKey}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>WTF Mint Worker - Admin Dashboard</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mint Worker Dashboard</h1>
          <button
            onClick={() => setApiKey('')}
            className="text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Worker Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Worker Status</h2>
              {status && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${status.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                      {status.isRunning ? 'Running' : 'Stopped'}
                    </div>
                    <div className="text-gray-600">Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {status.stats.eventsProcessed}
                    </div>
                    <div className="text-gray-600">Events Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatUptime(status.uptime)}
                    </div>
                    <div className="text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getStatusColor(status.monitoring.status)}`}>
                      {status.monitoring.status}
                    </div>
                    <div className="text-gray-600">Health</div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => controlWorker('start')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Start
                </button>
                <button
                  onClick={() => controlWorker('stop')}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Stop
                </button>
                <button
                  onClick={() => controlWorker('restart')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Restart
                </button>
                <button
                  onClick={() => controlWorker('reset_metrics')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Reset Metrics
                </button>
              </div>
            </div>

            {/* Contracts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Tracked Contracts</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Add New Contract</h3>
                <form onSubmit={addContract} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                  <input
                    type="text"
                    placeholder="Contract Address"
                    value={newContract.address}
                    onChange={(e) => setNewContract({ ...newContract, address: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contract Name"
                    value={newContract.name}
                    onChange={(e) => setNewContract({ ...newContract, name: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                  <select
                    value={newContract.type}
                    onChange={(e) => setNewContract({ ...newContract, type: e.target.value as 'ERC721' | 'ERC1155' })}
                    className="p-2 border rounded"
                  >
                    <option value="ERC721">ERC721</option>
                    <option value="ERC1155">ERC1155</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Project ID"
                    value={newContract.project_id}
                    onChange={(e) => setNewContract({ ...newContract, project_id: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    Add Contract
                  </button>
                </form>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Address</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Project ID</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr key={contract.address} className="border-t">
                        <td className="px-4 py-2 font-mono text-sm">{contract.address}</td>
                        <td className="px-4 py-2">{contract.name}</td>
                        <td className="px-4 py-2">{contract.type}</td>
                        <td className="px-4 py-2">{contract.project_id}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-sm ${contract.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {contract.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => removeContract(contract.address)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded ${getAlertColor(alert.level)}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{alert.message}</div>
                        {alert.details && (
                          <div className="text-sm mt-1 opacity-75">
                            {JSON.stringify(alert.details, null, 2)}
                          </div>
                        )}
                      </div>
                      <div className="text-sm opacity-75 ml-4">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}