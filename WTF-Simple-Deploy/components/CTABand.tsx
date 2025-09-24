import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CTABand() {
  return (
    <div className="py-12 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="relative"
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 120,
            damping: 15
          }}
          viewport={{ once: true }}
        >
          {/* Enhanced Glassmorphism pill */}
          <div className="relative backdrop-blur-xl bg-black/70 rounded-full p-6 shadow-2xl border-2 border-gray-600/30">
            {/* Enhanced glowing gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFE500]/40 via-blue-500/30 to-[#FF8C00]/40 p-[2px]">
              <div className="w-full h-full rounded-full bg-black/70 backdrop-blur-xl" />
            </div>

            {/* Inner glow effect */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#FFE500]/10 via-transparent to-[#FF8C00]/10 blur-sm" />

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left z-10">
              <motion.img
                src="/wtf-logo-trans.png"
                alt="WTF Logo"
                className="w-10 h-10 opacity-95 flex-shrink-0"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="flex-1">
                <span className="text-white font-medium text-xl">
                  <span className="text-[#FFE500] font-bold text-xl">$WTF?</span> — The fuel for fair launches + rewarding participation.
                </span>
              </div>
              <Link
                href="/leaderboard"
                className="group relative"
              >
                <motion.div
                  className="bg-gradient-to-r from-[#FFE500] to-[#FF8C00] text-black font-bold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(255, 229, 0, 0.6), 0 0 60px rgba(255, 140, 0, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}