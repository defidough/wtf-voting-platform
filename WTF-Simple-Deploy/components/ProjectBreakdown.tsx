import React from 'react'
import { motion } from 'framer-motion'

export default function ProjectBreakdown() {
  const steps = [
    {
      icon: '🗳️',
      title: 'Vote',
      description: 'The community decides what launches. Every vote earns XP.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💰',
      title: 'Presale',
      description: 'Winners get a fair 24h presale. Every mint earns XP.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '📈',
      title: 'Trade',
      description: 'Tokens launch via Firkin with LP and dev buy. Holders build reputation.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <section id="breakdown" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple three-step process that ensures every launch is fair, transparent, and community-driven.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 h-full transition-all duration-300 group-hover:shadow-2xl">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${step.gradient} mb-4`}>
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFE500] to-[#FFA500] text-black px-6 py-3 rounded-full font-semibold text-lg">
            <span>🔥</span>
            Ready to discover the next big launch?
            <span>🚀</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}