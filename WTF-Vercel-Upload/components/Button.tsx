import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  variant: 'yellow' | 'blue'
  onClick?: () => void
  className?: string
}

export default function Button({ children, variant, onClick, className = '' }: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md'

  const variantClasses = {
    yellow: 'bg-yellow-400 hover:bg-yellow-500 text-black',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white'
  }

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: variant === 'yellow'
          ? '0 10px 25px -5px rgba(251, 191, 36, 0.4)'
          : '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}