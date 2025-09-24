import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Button from './Button'
import TodaysSpotlight from './TodaysSpotlight'

export default function PremiumHero() {
  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50])


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Homepage-specific Gradient Blobs */}
      <div className="absolute inset-0">
        {/* Brighter Yellow/Orange Blob - Top Right (Homepage only) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-yellow-400/12 via-orange-500/6 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />

        {/* Brighter Blue/Purple Blob - Bottom Left (Homepage only) */}
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-radial from-blue-500/10 via-purple-600/5 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />

        {/* Enhanced Deep Purple Accent Blob - Center (Homepage only) */}
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-radial from-purple-500/8 via-indigo-600/4 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center px-6 py-24 md:py-32">
        <div className="text-center max-w-6xl mx-auto space-y-20 md:space-y-24">
          {/* Main Hero Text Section */}
          <div className="space-y-10 md:space-y-12">
            {/* Main brand hook */}
            <motion.h1
              className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-none tracking-tight drop-shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 md:mb-8">What The{' '}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-[#FF8C00] to-[#FF4500]"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                    filter: "drop-shadow(0 0 20px rgba(255, 229, 0, 0.3))"
                  }}
                >
                  Firkin
                </motion.span>
                ?
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-100 leading-tight">
                The Fair Presale Token Launching Platform for Base.
              </div>
            </motion.h1>

            {/* Subline */}
            <motion.p
              className="font-body text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Vote. Presale. Trade. Daily launches on Base — earn{' '}
              <span className="text-[#FFE500] font-semibold">⭐ XP</span> for every move.
            </motion.p>
          </div>

          {/* Today's Spotlight Section */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <TodaysSpotlight />
          </motion.div>

        </div>
      </div>

      {/* Subtle Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: 1.1,
          opacity: 0.5
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          type: "tween"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"
        animate={{
          scale: 1,
          opacity: 0.3
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          type: "tween"
        }}
      />
    </div>
  )
}