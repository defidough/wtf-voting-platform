import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from './Button'

export default function HeroSplit() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const slideInLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  }

  const slideInRight = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  }

  return (
    <motion.div
      className="flex min-h-[600px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left side - Traders */}
      <motion.div
        className="w-1/2 bg-blue-600 flex items-center justify-center p-12 relative overflow-hidden"
        variants={slideInLeft}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 left-20 text-6xl opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          🎯
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-20 text-4xl opacity-20"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          💎
        </motion.div>

        <div className="max-w-md text-center text-white relative z-10">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover the Spotlight
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-blue-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Vote, presale, and trade in daily token launches on Base.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/voting">
              <Button variant="yellow">
                View Voting →
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Builders */}
      <motion.div
        className="w-1/2 bg-gray-50 flex items-center justify-center p-12 relative overflow-hidden"
        variants={slideInRight}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 right-20 text-6xl opacity-20"
          animate={{ scale: 1.1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            type: "tween"
          }}
        >
          🏗️
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-20 text-4xl opacity-20"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🚀
        </motion.div>

        <div className="max-w-md text-center relative z-10">
          <motion.h1
            className="text-5xl font-bold mb-6 text-gray-900"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Launch with Integrity
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-gray-600"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Raise capital, build community, and launch fairly with WTF infrastructure.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/builder">
              <Button variant="blue">
                Submit Project →
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}