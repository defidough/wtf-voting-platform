import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectCardWithBadge from '@/components/ProjectCardWithBadge'
import VotingToolbar, { SortOption } from '@/components/VotingToolbar'
import XPToast from '@/components/XPToast'
import { getActiveVotingProjects, Project, incrementProjectVotes, MAX_DAYS_ACTIVE } from '@/lib/mockData'
import { useXP } from '@/contexts/XPContext'
import { shortenWallet } from '@/lib/xpSystem'
import { TrophyIcon } from '@/components/icons/WTFIcons'

export default function Voting() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showXPToast, setShowXPToast] = useState(false)
  const [xpAmount, setXpAmount] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('votes')
  const [currentPage, setCurrentPage] = useState(1)

  const PROJECTS_PER_PAGE = 12
  const BASE_DAILY_VOTES = 10

  const { awardXP, getUserTierData } = useXP()

  // Mock wallet for XP tracking
  const mockWallet = '0x1234567890abcdef1234567890abcdef12345678'
  const userTier = getUserTierData(mockWallet)
  const bonusVotes = userTier?.bonusVotes || 0
  const totalDailyVotes = BASE_DAILY_VOTES + bonusVotes

  const [remainingVotes, setRemainingVotes] = useState(totalDailyVotes)

  useEffect(() => {
    setProjects(getActiveVotingProjects())
  }, [])

  const handleVote = (projectId: string, voteCount: number) => {
    if (remainingVotes >= voteCount) {
      // Update project votes using the helper function
      setProjects(prev => incrementProjectVotes(prev, projectId, voteCount))

      // Decrease remaining votes
      setRemainingVotes(prev => prev - voteCount)

      // Award XP to the mock wallet
      awardXP(mockWallet, voteCount)

      // Set XP amount and show toast
      setXpAmount(voteCount)
      setShowXPToast(true)
    }
  }

  const hideXPToast = () => {
    setShowXPToast(false)
  }

  // Search and filter logic
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.builderWallet && project.builderWallet.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.builderWallet && shortenWallet(project.builderWallet).toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort logic
    let sorted = [...filtered]
    switch (sortBy) {
      case 'votes':
        sorted.sort((a, b) => b.votes - a.votes)
        break
      case 'hot':
        sorted.sort((a, b) => (b.votes + b.priorityScore) - (a.votes + a.priorityScore))
        break
      case 'newest':
        sorted.sort((a, b) => {
          if (a.daysActive !== b.daysActive) {
            return a.daysActive - b.daysActive // Newer projects (lower daysActive) first
          }
          return b.votes - a.votes // Secondary sort by votes
        })
        break
      case 'ending':
        sorted.sort((a, b) => b.daysActive - a.daysActive) // Highest daysActive first
        break
      case 'random':
        sorted = sorted.sort(() => Math.random() - 0.5)
        break
      default:
        break
    }

    return sorted
  }, [projects, searchTerm, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProjects.length / PROJECTS_PER_PAGE)
  const paginatedProjects = filteredAndSortedProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  )

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy])

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
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00]">Daily Voting</span>
              </h1>
              <p className="font-body text-lg text-gray-300 mb-6">
                Shape the future of fair launches. Every vote counts.
              </p>

              {/* Votes Remaining Card */}
              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Glowing gradient border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 p-[1px]">
                  <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
                </div>

                <div className="relative px-8 py-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-gray-300">You have</span>
                    <span className="font-display font-bold text-[#FFE500] text-2xl">{remainingVotes}</span>
                    <span className="font-body text-gray-300">votes remaining today</span>
                    <span className="font-body text-[#FFE500] text-sm ml-4 bg-[#FFE500]/10 px-3 py-1 rounded-full">
                      +1 XP per vote
                    </span>
                  </div>

                  {/* Tier Info */}
                  {userTier && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrophyIcon size={16} />
                      <span className="text-gray-400">Tier {userTier.id}</span>
                      <span className="text-white font-semibold">— {userTier.name}</span>
                      <span className="text-blue-400">(+{bonusVotes} bonus votes)</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <VotingToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalProjects={filteredAndSortedProjects.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {paginatedProjects.map((project, index) => {
                // Calculate rank based on current sort order and pagination
                const rank = (currentPage - 1) * PROJECTS_PER_PAGE + index + 1
                return (
                  <motion.div key={project.id} variants={cardVariants}>
                    <ProjectCardWithBadge
                      project={project}
                      remainingVotes={remainingVotes}
                      onVote={handleVote}
                      rank={rank}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </main>

      <XPToast
        xpAmount={xpAmount}
        isVisible={showXPToast}
        onHide={hideXPToast}
      />
    </>
  )
}