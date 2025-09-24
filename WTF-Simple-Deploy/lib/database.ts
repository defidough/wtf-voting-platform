import Database from 'better-sqlite3'
import path from 'path'
import crypto from 'crypto'

const dbPath = path.join(process.cwd(), 'data.db')
const db = new Database(dbPath)

// Initialize database schema
export function initDatabase() {
  // Create nonces table
  db.exec(`
    CREATE TABLE IF NOT EXISTS nonces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address TEXT NOT NULL UNIQUE,
      nonce TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    )
  `)

  // Create sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      is_active BOOLEAN DEFAULT 1
    )
  `)

  // Create used_nonces table to prevent replay attacks
  db.exec(`
    CREATE TABLE IF NOT EXISTS used_nonces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nonce TEXT NOT NULL UNIQUE,
      wallet_address TEXT NOT NULL,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    )
  `)

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_nonces_wallet ON nonces(wallet_address);
    CREATE INDEX IF NOT EXISTS idx_sessions_wallet ON sessions(wallet_address);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_used_nonces_nonce ON used_nonces(nonce);
    CREATE INDEX IF NOT EXISTS idx_used_nonces_wallet ON used_nonces(wallet_address);
  `)
}

// Nonce operations
export interface NonceRecord {
  id: number
  wallet_address: string
  nonce: string
  created_at: string
  expires_at: string
}

// Initialize database on import
initDatabase()

export const nonceQueries = {
  create: db.prepare(`
    INSERT OR REPLACE INTO nonces (wallet_address, nonce, expires_at)
    VALUES (?, ?, datetime('now', '+5 minutes'))
  `),

  get: db.prepare(`
    SELECT * FROM nonces
    WHERE wallet_address = ? AND expires_at > datetime('now')
  `),

  delete: db.prepare(`
    DELETE FROM nonces WHERE wallet_address = ?
  `),

  cleanup: db.prepare(`
    DELETE FROM nonces WHERE expires_at <= datetime('now')
  `)
}

// Session operations
export interface SessionRecord {
  id: number
  wallet_address: string
  token_hash: string
  created_at: string
  expires_at: string
  is_active: boolean
}

export const sessionQueries = {
  create: db.prepare(`
    INSERT INTO sessions (wallet_address, token_hash, expires_at)
    VALUES (?, ?, datetime('now', '+7 days'))
  `),

  get: db.prepare(`
    SELECT * FROM sessions
    WHERE token_hash = ? AND expires_at > datetime('now') AND is_active = 1
  `),

  getByWallet: db.prepare(`
    SELECT * FROM sessions
    WHERE wallet_address = ? AND expires_at > datetime('now') AND is_active = 1
  `),

  deactivate: db.prepare(`
    UPDATE sessions SET is_active = 0 WHERE wallet_address = ?
  `),

  cleanup: db.prepare(`
    DELETE FROM sessions WHERE expires_at <= datetime('now') OR is_active = 0
  `)
}

// Used nonces operations (for replay attack prevention)
export interface UsedNonceRecord {
  id: number
  nonce: string
  wallet_address: string
  used_at: string
  expires_at: string
}

export const usedNonceQueries = {
  create: db.prepare(`
    INSERT INTO used_nonces (nonce, wallet_address, expires_at)
    VALUES (?, ?, datetime('now', '+24 hours'))
  `),

  check: db.prepare(`
    SELECT COUNT(*) as count FROM used_nonces
    WHERE nonce = ? AND expires_at > datetime('now')
  `),

  cleanup: db.prepare(`
    DELETE FROM used_nonces WHERE expires_at <= datetime('now')
  `)
}

// Utility functions
export function generateNonce(): string {
  // Use crypto.randomUUID() as recommended by Base docs for secure nonce generation
  // Remove hyphens to create a clean nonce string
  return crypto.randomUUID().replace(/-/g, '')
}

export function cleanupExpired() {
  nonceQueries.cleanup.run()
  sessionQueries.cleanup.run()
  usedNonceQueries.cleanup.run()
}

export default db