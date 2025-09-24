import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface XPToastProps {
  xpAmount: number
  isVisible: boolean
  onHide: () => void
}

export default function XPToast({ xpAmount, isVisible, onHide }: XPToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              x: 50,
              scale: 0.8,
              rotate: 5
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              rotate: 0
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.9,
              transition: { duration: 0.3 }
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.6
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-xl border border-green-400"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: 15 }}
                transition={{
                  delay: 0.4,
                  duration: 0.5,
                  repeat: 2,
                  repeatType: "reverse",
                  type: "tween"
                }}
                className="text-lg"
              >
                🎉
              </motion.span>
              <span className="font-bold text-lg">+{xpAmount} XP earned!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}