import React, { useState } from 'react'
import { motion } from 'framer-motion'
import BuilderForm from '@/components/BuilderForm'
import PendingProjectCard from '@/components/PendingProjectCard'
import { getSubmissions, getArchivedProjects } from '@/lib/mockData'
import { EthIcon, ChartIcon, PresaleIcon, NetworkIcon, RocketIcon } from '@/components/icons/WTFIcons'

export default function Builder() {
  const [refreshKey, setRefreshKey] = useState(0)
  const submissions = getSubmissions()
  const archivedProjects = getArchivedProjects()

  const handleFormSubmit = () => {
    setRefreshKey(prev => prev + 1)
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  return (
    <>
      <main className="flex-1 pt-32 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00]">Launch Your Token with WTF</span>
            </h1>
            <p className="font-body text-xl text-gray-300 mb-6">
              The fair presale ecosystem that rewards builders, voters, and holders.
            </p>

            {/* XP Reward Card */}
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Glowing gradient border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px]">
                <div className="w-full h-full rounded-full bg-black/90 backdrop-blur-sm" />
              </div>

              <div className="relative flex items-center gap-2 px-8 py-4">
                <span className="font-body text-gray-300">Earn</span>
                <span className="font-display font-bold text-[#FFE500] text-xl">+10 XP</span>
                <span className="font-body text-gray-300">per proposal submitted via WTF</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Why Build with WTF Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Build with WTF?</h2>
              <p className="text-lg text-gray-400">Join the most successful fair launch platform on Base</p>
            </div>

            {/* Benefits Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
              {/* Row 1 - 3 cards */}
              <motion.div
                className="relative group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>

                <div className="relative p-6 text-center">
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EthIcon
                      className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300"
                      size={48}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">Earn <span className="text-[#FFE500]">60%</span> of Fees in WETH</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    No need to sell your tokens to fund development — you earn directly in <span className="text-[#FFE500] font-semibold">WETH</span>.
                  </p>
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>

              <motion.div
                className="relative group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>

                <div className="relative p-6 text-center">
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChartIcon
                      className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300"
                      size={48}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">More Volatility = More Revenue</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Dynamic fees automatically adjust with volume, rewarding builders when their token is <span className="text-[#FFE500] font-semibold">active</span>.
                  </p>
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>

              <motion.div
                className="relative group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>

                <div className="relative p-6 text-center">
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PresaleIcon
                      className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300"
                      size={48}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">Fair Presales with Proven Demand</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Over <span className="text-[#FFE500] font-semibold">$200,000</span> raised across WTF presales to date, powering healthy launches.
                  </p>
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            </div>

            {/* Row 2 - 2 cards centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div
                className="relative group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>

                <div className="relative p-6 text-center">
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NetworkIcon
                      className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300"
                      size={48}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">Liquid, Distributed Exposure</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    As one of <span className="text-[#FFE500] font-semibold">Clanker's most successful interface launchers</span>, WTF gives your project distributed liquidity and attention.
                  </p>
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>

              <motion.div
                className="relative group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>

                <div className="relative p-6 text-center">
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RocketIcon
                      className="drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(255,229,0,0.6)] transition-all duration-300"
                      size={48}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">Powered by Clanker v4</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Your token launches on <span className="text-[#FFE500] font-semibold">Clanker v4 protocol</span> — trusted, secure, and battle-tested.
                  </p>
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/5 via-[#FF8C00]/5 to-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="builder-form"
          >
            <BuilderForm onSubmit={handleFormSubmit} />
          </motion.div>


          {submissions.length > 0 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="font-display text-2xl font-bold text-white mb-6">
                Submitted Projects (Pending Voting)
              </h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {submissions.map(project => (
                  <motion.div key={`${project.id}-${refreshKey}`} variants={cardVariants}>
                    <PendingProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {archivedProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-white mb-6">
                Archived Projects
              </h2>
              <p className="font-body text-gray-400 mb-6">
                Projects that completed their 5-day voting period without winning.
              </p>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {archivedProjects.map(project => (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    {/* Subtle wood grain texture overlay */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-5 bg-cover bg-center mix-blend-overlay"
                      style={{
                        backgroundImage: 'url(/barrel-bg.jpeg)',
                        filter: 'contrast(0.3) brightness(0.4)'
                      }}
                    />

                    {/* Glowing gradient border */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 via-gray-500/20 to-gray-600/20 p-[1px] group-hover:from-gray-500/30 group-hover:via-gray-400/30 group-hover:to-gray-500/30 transition-all duration-300">
                      <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                    </div>

                    <div className="relative p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-3">
                          {project.isImageLogo ? (
                            <img
                              src={project.logo}
                              alt={`${project.name} logo`}
                              className="w-16 h-16 object-cover rounded-xl border border-gray-600 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                            />
                          ) : (
                            <div className="text-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-300">{project.logo}</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{project.name}</h3>
                          <p className="font-body text-gray-500">${project.ticker}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-gray-400 hover:text-gray-300 underline break-all transition-colors duration-200"
                        >
                          {project.url}
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-body text-gray-500">Archived after {project.daysActive} days</span>
                        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-full text-xs border border-gray-700">
                          Expired
                        </span>
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-400/5 via-gray-300/5 to-gray-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}