import React from 'react'
import TickerBar from './TickerBar'
import NavBar from './NavBar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Barrel Wood Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/barrel-bg.jpeg)'
        }}
      />

      {/* Dark Overlay with Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-[#0B1426]/60 to-[#1e1b4b]/70" />

      {/* Radial Vignette */}
      <div className="fixed inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80" />

      {/* Enhanced Gradient Blobs */}
      <div className="fixed inset-0">
        {/* Yellow/Orange Blob - Top Right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-yellow-400/8 via-orange-500/4 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />

        {/* Blue/Purple Blob - Bottom Left */}
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-radial from-blue-500/6 via-purple-600/3 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />

        {/* Deep Purple Accent Blob - Center */}
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-radial from-purple-500/4 via-indigo-600/2 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Persistent TickerBar */}
      <div className="fixed top-0 left-0 right-0 z-50 will-change-auto">
        <TickerBar />
      </div>

      {/* Persistent NavBar */}
      <div className="relative z-40">
        <NavBar />
      </div>

      {/* Page content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* Persistent Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  )
}