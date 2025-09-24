import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { VotingIcon, PresaleIcon, BuilderIcon, TrophyIcon, StarIcon } from './icons/WTFIcons'

interface FeatureCard {
  icon: JSX.Element
  title: string
  description: string
  href: string
  buttonText: string
}

export default function FeatureGrid() {
  const features: FeatureCard[] = [
    {
      icon: <VotingIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Voting',
      description: 'The community decides. One vote free. More with $WTF? holdings.',
      href: '/voting',
      buttonText: 'Vote Now'
    },
    {
      icon: <PresaleIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Presales',
      description: 'Winning projects launch with a fair 24h presale. Snipers buy later.',
      href: '/presale',
      buttonText: 'View Presale'
    },
    {
      icon: <BuilderIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Building',
      description: 'Builders submit ideas, gain exposure, and earn XP with every proposal.',
      href: '/builder',
      buttonText: 'Submit Project'
    },
    {
      icon: <TrophyIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'Leaderboards',
      description: 'Track top voters, builders, and contributors in real time.',
      href: '/leaderboard',
      buttonText: 'View Rankings'
    },
    {
      icon: <StarIcon className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)]" size={32} />,
      title: 'XP',
      description: 'Earn XP for every vote, mint, and proposal. Climb the ranks. Unlock perks.',
      href: '/xp',
      buttonText: 'Learn More'
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Learn More About WTF
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore the features that make WTF the premier fair launch platform on Base
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="group"
            >
              <Link href={feature.href} className="block">
                <div className="relative group cursor-pointer">
                  {/* Barrel wood grain texture overlay */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-8 bg-cover bg-center mix-blend-overlay"
                    style={{
                      backgroundImage: 'url(/barrel-bg.jpeg)',
                      filter: 'contrast(0.3) brightness(0.4)'
                    }}
                  />

                  {/* Glowing gradient border */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] group-hover:from-[#FFE500]/50 group-hover:via-[#FF8C00]/50 group-hover:to-[#FF4500]/50 transition-all duration-300">
                    <div className="w-full h-full rounded-xl bg-black/95 backdrop-blur-sm" />
                  </div>

                  {/* Card content */}
                  <div className="relative p-6 h-full flex flex-col">
                    {/* Glowing background effect on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFE500]/5 via-transparent to-[#FF8C00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="text-center relative z-10 flex-1 flex flex-col">
                      <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                        {feature.description}
                      </p>

                      {/* CTA Button */}
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#FFE500]/20 to-[#FF8C00]/20 border border-[#FFE500]/40 rounded-full text-[#FFE500] text-sm font-semibold group-hover:from-[#FFE500]/30 group-hover:to-[#FF8C00]/30 group-hover:border-[#FFE500]/60 transition-all duration-300">
                        {feature.buttonText}
                        <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}