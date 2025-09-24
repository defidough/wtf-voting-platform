import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { XPProvider } from '@/contexts/XPContext'
import { AuthProvider } from '@/contexts/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>What The Firkin? - The Fair Launch Platform</title>
        <meta name="description" content="Vote, presale, and trade in daily token launches on Base — participate to earn XP." />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Premium Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <AuthProvider>
        <XPProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </XPProvider>
      </AuthProvider>
    </>
  )
}