export interface Project {
  id: string
  name: string
  ticker: string
  logo: string
  url: string
  votes: number
  isImageLogo?: boolean
  daysActive: number
  priorityScore: number
  builderWallet?: string
  vaultedSupply?: number // 0-30%, locked for 30 days from TGE
}

export interface EcosystemLaunch {
  id: string
  contract_address: string
  name: string
  symbol: string // ticker/symbol
  logo?: string // emoji or image URL
  url?: string
  isImageLogo?: boolean
  dev_buy?: number // total presale raised from API (in ETH)
  currentMcap: number // in USD
  fdv: number // Fully Diluted Valuation in USD
  launchDate: string // ISO date string (created_at from API)
  priceChange24h?: number // percentage
  volume24h?: number // in USD
  ath?: number // all-time high market cap
  supply?: string // total supply
  chain_id: number // blockchain ID (8453 for Base)
}

export const MAX_DAYS_ACTIVE = 5

// Split project arrays for lifecycle management
export const submissions: Project[] = [
  {
    id: 'sub-1',
    name: 'AI Trading Bot',
    ticker: 'AITB',
    logo: '🤖',
    url: 'https://aitrading.bot',
    votes: 0,
    daysActive: 0,
    priorityScore: 0,
    builderWallet: '0xabcdef1234567890abcdef1234567890abcdef12',
    vaultedSupply: 15
  },
  {
    id: 'sub-2',
    name: 'Decentralized Storage',
    ticker: 'DSTOR',
    logo: '💾',
    url: 'https://decentstore.io',
    votes: 0,
    daysActive: 0,
    priorityScore: 0,
    builderWallet: '0x9876543210fedcba9876543210fedcba98765432',
    vaultedSupply: 20
  }
]

export const activeVotingProjects: Project[] = [
  {
    id: '1',
    name: 'DeFi Yield Protocol',
    ticker: 'DYP',
    logo: '🌾',
    url: 'https://defiyield.com',
    votes: 23,
    daysActive: 2,
    priorityScore: 2,
    builderWallet: '0x742d35Cc6635C0532925a3b8D82E8DB7dc2f7b90',
    vaultedSupply: 30
  },
  {
    id: '2',
    name: 'Base Social Network',
    ticker: 'BSN',
    logo: '🔗',
    url: 'https://basesocial.xyz',
    votes: 18,
    daysActive: 1,
    priorityScore: 1,
    builderWallet: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    vaultedSupply: 10
  },
  {
    id: '3',
    name: 'NFT Marketplace Plus',
    ticker: 'NMP',
    logo: '🎨',
    url: 'https://nftmarketplus.io',
    votes: 14,
    daysActive: 3,
    priorityScore: 1,
    builderWallet: '0x1234567890abcdef1234567890abcdef12345678',
    vaultedSupply: 5
  },
  {
    id: '4',
    name: 'Cross Chain Bridge',
    ticker: 'CCB',
    logo: '🌉',
    url: 'https://crossbridge.fi',
    votes: 8,
    daysActive: 4,
    priorityScore: 0,
    builderWallet: '0x9876543210fedcba9876543210fedcba98765432',
    vaultedSupply: 0
  },
  {
    id: '5',
    name: 'Mobile Wallet SDK',
    ticker: 'MSDK',
    logo: '📱',
    url: 'https://mobilesdk.dev',
    votes: 6,
    daysActive: 1,
    priorityScore: 0,
    builderWallet: '0xabcdef1234567890abcdef1234567890abcdef12',
    vaultedSupply: 12
  },
  {
    id: '6',
    name: 'DAO Governance Tool',
    ticker: 'DGOV',
    logo: '🏛️',
    url: 'https://daotools.xyz',
    votes: 4,
    daysActive: 2,
    priorityScore: 0,
    builderWallet: '0x742d35Cc6635C0532925a3b8D82E8DB7dc2f7b90',
    vaultedSupply: 18
  },
  {
    id: '7',
    name: 'Privacy Mixer',
    ticker: 'PMIX',
    logo: '🔒',
    url: 'https://privacymix.io',
    votes: 2,
    daysActive: 5,
    priorityScore: 0,
    builderWallet: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    vaultedSupply: 22
  }
]

export const currentWinningProject: WinningProject = {
  id: 'winning-1',
  name: 'Gaming Token Hub',
  ticker: 'GTH',
  logo: '🎮',
  url: 'https://gamingtoken.gg',
  presaleMints: 1200,
  endsAt: Date.now() + (24 * 60 * 60 * 1000),
  isImageLogo: false,
  vaultedSupply: 25
}

export const archivedProjects: Project[] = [
  {
    id: 'arch-1',
    name: 'Lending Protocol',
    ticker: 'LEND',
    logo: '💰',
    url: 'https://lendingpro.base',
    votes: 0,
    daysActive: 5,
    priorityScore: 1,
    builderWallet: '0x1234567890abcdef1234567890abcdef12345678',
    vaultedSupply: 8
  }
]

export const incrementProjectVotes = (projects: Project[], projectId: string, voteCount: number): Project[] => {
  return projects.map(project =>
    project.id === projectId
      ? { ...project, votes: project.votes + voteCount }
      : project
  )
}

export const addSubmittedProject = (project: Omit<Project, 'id' | 'votes' | 'daysActive' | 'priorityScore'>): Project => {
  const newProject: Project = {
    ...project,
    id: `submitted-${Date.now()}`,
    votes: 0,
    daysActive: 0,
    priorityScore: 0,
    builderWallet: '0x1234567890abcdef1234567890abcdef12345678', // Mock wallet
    vaultedSupply: project.vaultedSupply || 0
  }
  submissions.push(newProject)
  return newProject
}

export const getSubmissions = (): Project[] => {
  return submissions
}

export const getActiveVotingProjects = (): Project[] => {
  return activeVotingProjects
}

export const getCurrentWinningProject = (): WinningProject => {
  return currentWinningProject
}

export const getArchivedProjects = (): Project[] => {
  return archivedProjects
}

export const getAllProjects = (): Project[] => {
  return [...submissions, ...activeVotingProjects, ...archivedProjects]
}

export interface XPLogEntry {
  type: 'vote' | 'presale' | 'builder'
  amount: number
  timestamp: Date
}

export interface User {
  wallet: string
  voteXP: number
  presaleXP: number
  builderXP: number
  totalXP: number
  votesCast: number
  mintsContributed: number
  projectsSubmitted: number
  xpLogs: XPLogEntry[]
}

const generateMockLogs = (voteXP: number, presaleXP: number, builderXP: number): XPLogEntry[] => {
  const logs: XPLogEntry[] = []
  const now = new Date()

  // Generate vote logs (distributed over the last 30 days)
  for (let i = 0; i < voteXP; i++) {
    logs.push({
      type: 'vote',
      amount: 1,
      timestamp: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    })
  }

  // Generate presale logs (distributed over the last 30 days)
  for (let i = 0; i < presaleXP; i++) {
    logs.push({
      type: 'presale',
      amount: 1,
      timestamp: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    })
  }

  // Generate builder logs (fewer, more recent)
  for (let i = 0; i < builderXP; i += 10) {
    logs.push({
      type: 'builder',
      amount: 10,
      timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    })
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export const mockUsers: User[] = [
  {
    wallet: '0x742d35Cc6635C0532925a3b8D82E8DB7dc2f7b90',
    voteXP: 42,
    presaleXP: 65,
    builderXP: 20,
    totalXP: 127,
    votesCast: 42,
    mintsContributed: 65,
    projectsSubmitted: 2,
    xpLogs: generateMockLogs(42, 65, 20)
  },
  {
    wallet: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    voteXP: 31,
    presaleXP: 54,
    builderXP: 10,
    totalXP: 95,
    votesCast: 31,
    mintsContributed: 54,
    projectsSubmitted: 1,
    xpLogs: generateMockLogs(31, 54, 10)
  },
  {
    wallet: '0x1234567890abcdef1234567890abcdef12345678',
    voteXP: 24,
    presaleXP: 39,
    builderXP: 10,
    totalXP: 73,
    votesCast: 24,
    mintsContributed: 39,
    projectsSubmitted: 1,
    xpLogs: generateMockLogs(24, 39, 10)
  },
  {
    wallet: '0x9876543210fedcba9876543210fedcba98765432',
    voteXP: 18,
    presaleXP: 38,
    builderXP: 0,
    totalXP: 56,
    votesCast: 18,
    mintsContributed: 38,
    projectsSubmitted: 0,
    xpLogs: generateMockLogs(18, 38, 0)
  },
  {
    wallet: '0xabcdef1234567890abcdef1234567890abcdef12',
    voteXP: 11,
    presaleXP: 23,
    builderXP: 0,
    totalXP: 34,
    votesCast: 11,
    mintsContributed: 23,
    projectsSubmitted: 0,
    xpLogs: generateMockLogs(11, 23, 0)
  }
]

export const getMockUsers = (): User[] => {
  return mockUsers
}

export interface WinningProject {
  id: string
  name: string
  ticker: string
  logo: string
  url: string
  presaleMints: number
  endsAt: number
  isImageLogo?: boolean
  vaultedSupply?: number // 0-30%, locked for 30 days from TGE
}


export const incrementPresaleMints = (amount: number): void => {
  currentWinningProject.presaleMints += amount
}

// WTF Ecosystem Launches - Real launch data
export const ecosystemLaunches: EcosystemLaunch[] = [
  {
    id: 'wtf-1',
    contract_address: '0x9A4D496A08b2df2b1b115d2cDF9c0a5629384b07',
    name: 'What The Firkin?',
    symbol: 'WTF?',
    logo: 'https://nft-cdn.alchemy.com/base-mainnet/f667dd7f1fae584121e1bc77fec15e5d',
    url: 'https://www.clanker.world/clanker/0x9A4D496A08b2df2b1b115d2cDF9c0a5629384b07',
    isImageLogo: true,
    dev_buy: 14.6150,
    currentMcap: 189700,
    fdv: 275000,
    launchDate: '2025-06-05T00:00:00Z',
    priceChange24h: -1.41,
    volume24h: 953.40,
    chain_id: 8453
  },
  {
    id: 'clanks-1',
    contract_address: '0x601A4d14fb720A591bB1DE41232EB122DD905B07',
    name: 'Clank Clank!',
    symbol: 'CLANKS',
    logo: 'https://4a55dbx5oezxc23fep4rkas6vbfsqoly7yadq4lcyn2ucw7uya4q.arweave.net/4DvRhv1xM3FrZSP5FQJeqEsoOXj-ADhxYsN1QVv0wDk',
    url: 'https://www.clanker.world/clanker/0x601A4d14fb720A591bB1DE41232EB122DD905B07',
    isImageLogo: true,
    dev_buy: 27.4200,
    currentMcap: 111147,
    fdv: 158782,
    launchDate: '2025-07-26T00:00:00Z',
    priceChange24h: -8.75,
    volume24h: 3565.98,
    chain_id: 8453
  },
  {
    id: 'bafo-1',
    contract_address: '0x2C3cD8eB8c6bd8B36Ed3aC63f5f2E58B6C159b07',
    name: 'Bank around, find out.',
    symbol: 'BAFO',
    logo: 'https://lrt5ufqekaxxdkerzglwaq2zakhxnemmhk4npblueumed7y4vh4a.arweave.net/XGfaFgRQL3GokcmXYENZAo92kYw6uNeFdCUYQf8cqfg',
    url: 'https://www.clanker.world/clanker/0x2C3cD8eB8c6bd8B36Ed3aC63f5f2E58B6C159b07',
    isImageLogo: true,
    dev_buy: 6.0000,
    currentMcap: 44100,
    fdv: 58500,
    launchDate: '2025-08-18T00:00:00Z',
    priceChange24h: 0,
    volume24h: 0,
    chain_id: 8453
  },
  {
    id: 'brb-1',
    contract_address: '0x641e503278B34614A6425dAd5757112ddC5A9B07',
    name: 'Brian boru',
    symbol: 'BRB',
    logo: 'https://www.wtfirkin.com/api/images/9',
    url: 'https://www.clanker.world/clanker/0x641e503278B34614A6425dAd5757112ddC5A9B07',
    isImageLogo: true,
    dev_buy: 0.66,
    currentMcap: 43000,
    fdv: 57200,
    launchDate: '2025-08-24T00:00:00Z',
    priceChange24h: 0,
    volume24h: 0,
    chain_id: 8453
  },
  {
    id: 'gmn-1',
    contract_address: '0xF461FFe8F93B7678b362abe54CDCC89EB3E6Ab07',
    name: 'GeckoMoon',
    symbol: 'GMN',
    logo: 'https://n4hajfxxffxnhquwihbeucu22dv5nlc4o3skm6z7lwnpi4dqtpjq.arweave.net/bw4ElvcpbtPClkHCSgqa0OvWrFx25KZ7P12a9HBwm9M',
    url: 'https://www.clanker.world/clanker/0xF461FFe8F93B7678b362abe54CDCC89EB3E6Ab07',
    isImageLogo: true,
    dev_buy: 0.26,
    currentMcap: 43800,
    fdv: 62500,
    launchDate: '2025-08-30T00:00:00Z',
    priceChange24h: 0,
    volume24h: 0,
    chain_id: 8453
  },
  {
    id: 'flywl-1',
    contract_address: '0xc12ba2a27B18267461b6B177b05f82A193c12B07',
    name: 'FLYWHEEL',
    symbol: 'FLYWL',
    logo: 'https://zmytagse74otdhxgikcht2bb2v6igccheaohp2m4xzqa5ldv6fwa.arweave.net/yzEwGkT_HTGe5kKEeegh1XyDCEcgHHfpnL5gDqx18Ww',
    url: 'https://www.clanker.world/clanker/0xc12ba2a27B18267461b6B177b05f82A193c12B07',
    isImageLogo: true,
    dev_buy: 0.26,
    currentMcap: 41400,
    fdv: 59200,
    launchDate: '2025-09-18T00:00:00Z',
    priceChange24h: 0,
    volume24h: 28.30,
    chain_id: 8453
  },
  {
    id: 'wake-1',
    contract_address: '0x8173bec82486E15a0F3C236C28451BCcc6A0DB07',
    name: 'Wake Coin',
    symbol: 'WAKE',
    logo: 'https://ttnrblvn7ney3525w2enepxbaxpryqwodh66cltiaqet3rxqpdeq.arweave.net/nNsQrq37SY33XbaI0j7hBd8cQs4Z_eEuaAQJPcbweMk',
    url: 'https://www.clanker.world/clanker/0x8173bec82486E15a0F3C236C28451BCcc6A0DB07',
    isImageLogo: true,
    dev_buy: 2.86,
    currentMcap: 44400,
    fdv: 63400,
    launchDate: '2025-08-27T00:00:00Z',
    priceChange24h: 0,
    volume24h: 0,
    chain_id: 8453
  },
  {
    id: 'fifty-1',
    contract_address: '0x5066262FF9bF227aA90053254B41ce8c5E2fdb07',
    name: '-$50.01',
    symbol: 'FIFTY',
    logo: 'https://blv45ysksfianhddhfess2x5rz3oppkl3amt3bmwj7dtmcwexf5q.arweave.net/CuvO4kqRUAacYzlJKWr9jnbnvUvYGT2Flk_HNgrEuXs',
    url: 'https://www.clanker.world/clanker/0x5066262FF9bF227aA90053254B41ce8c5E2fdb07',
    isImageLogo: true,
    dev_buy: 1.74,
    currentMcap: 41500,
    fdv: 41500,
    launchDate: '2025-08-22T00:00:00Z',
    priceChange24h: 0,
    volume24h: 28.0,
    vaultedSupply: 20,
    chain_id: 8453
  },
  {
    id: 'babydusk-1',
    contract_address: '0x22D49a8C50dA78Bf1E9Cf81109A5c46534D99B07',
    name: 'Babydusk',
    symbol: 'BDUSK',
    logo: 'https://yeufktf6qxaavpsuajww42p3r2rshk6tyhvloaqrw3ci7vmyj3ua.arweave.net/wShVTL6FwAq-VAJtbmn7jqMjq9PB6rcCEbbEj9WYTug',
    url: 'https://www.clanker.world/clanker/0x22D49a8C50dA78Bf1E9Cf81109A5c46534D99B07',
    isImageLogo: true,
    dev_buy: 0.03,
    currentMcap: 67800,
    fdv: 67800,
    launchDate: '2025-09-24T00:00:00Z',
    priceChange24h: 58.75,
    volume24h: 8533.56,
    vaultedSupply: 30,
    chain_id: 8453
  }
]

export const getEcosystemLaunches = (): EcosystemLaunch[] => {
  return ecosystemLaunches
}