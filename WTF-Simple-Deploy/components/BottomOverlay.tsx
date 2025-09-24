import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function BottomOverlay() {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <motion.div
        className="relative backdrop-blur-md bg-black/80 rounded-full px-4 md:px-6 py-1.5 md:py-2 shadow-2xl"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 25px 50px -12px rgba(255, 229, 0, 0.4)"
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Glowing gradient border */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFE500] via-blue-500 to-[#FFE500] p-[1px]">
          <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-md" />
        </div>

        <div className="relative flex items-center gap-3 text-xs md:text-sm">
          <img
            src="/wtf-logo-trans.png"
            alt="WTF Logo"
            className="w-6 h-6 opacity-80"
          />
          <span className="text-white font-medium">
            <span className="text-[#FFE500] font-bold">$WTF?</span> — The fuel for fair launches + rewarding participation.
          </span>
          <Link
            href="/leaderboard"
            className="text-[#FFE500] hover:text-[#FFA500] font-bold transition-colors duration-200 whitespace-nowrap"
          >
            Learn More →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}