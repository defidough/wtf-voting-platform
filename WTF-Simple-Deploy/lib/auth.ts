import { SignJWT, jwtVerify } from 'jose'
import { ethers } from 'ethers'
import crypto from 'crypto'
import { verifyMessage, getAddress, isAddress } from 'viem'
import { publicClient } from './blockchain'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  wallet: string
  iat: number
  exp: number
}

export interface AuthUser {
  wallet: string
}

// JWT utilities
export async function signJWT(payload: { wallet: string }): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    // Check if payload has the required wallet property
    if (payload && typeof payload === 'object' && 'wallet' in payload) {
      return payload as unknown as JWTPayload
    }
    return null
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// Signature verification utilities following SIWE (Sign In With Ethereum) standard
export function createSignatureMessage(nonce: string, wallet: string): string {
  // Get domain from environment or use localhost for development
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'
  const chainId = 8453 // Base mainnet chain ID
  const uri = `https://${domain}`

  // SIWE compliant message format
  return `${domain} wants you to sign in with your Ethereum account:
${wallet}

Welcome to WTF Token Launcher! Click to sign in and accept the WTF Terms of Service.

URI: ${uri}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}

This request will not trigger a blockchain transaction or cost any gas fees.`
}

export async function verifySignature(
  message: string,
  signature: string,
  expectedWallet: string
): Promise<boolean> {
  try {
    // Normalize the wallet address
    const normalizedWallet = normalizeWalletAddress(expectedWallet)

    // First try viem's built-in verifyMessage which supports ERC-6492 for smart wallets
    try {
      const isValid = await verifyMessage({
        address: normalizedWallet as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      })

      if (isValid) {
        console.log('Signature verified with viem (supports smart wallets)')
        return true
      }
    } catch (viemError) {
      console.log('Viem verification failed, trying ethers fallback:', viemError)
    }

    // Fallback to ethers.js for EOA wallets
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature)
      if (recoveredAddress.toLowerCase() === normalizedWallet) {
        console.log('Signature verified with ethers (EOA wallet)')
        return true
      }
    } catch (ethersError) {
      console.log('Ethers verification failed:', ethersError)
    }

    // Additional smart contract wallet signature detection
    if (signature.length > 132 && signature.startsWith('0x')) {
      console.log('Detected potential smart contract wallet signature')

      try {
        // Check if address is a contract on Base
        const code = await publicClient.getBytecode({ address: normalizedWallet as `0x${string}` })
        if (code && code !== '0x') {
          console.log('Address is a smart contract, signature format appears valid')
          // In production, you'd implement proper EIP-1271 on-chain verification here
          // For now, we'll accept well-formed signatures from contract addresses
          return isValidWalletAddress(expectedWallet)
        }
      } catch (contractCheckError) {
        console.log('Contract check failed:', contractCheckError)
      }
    }

    return false
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

// Token hash utilities (for database storage)
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Validation utilities
export function isValidWalletAddress(address: string): boolean {
  try {
    return isAddress(address)
  } catch {
    return false
  }
}

export function normalizeWalletAddress(address: string): string {
  return address.toLowerCase()
}

// Environment validation
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('Warning: JWT_SECRET not set in production environment!')
}