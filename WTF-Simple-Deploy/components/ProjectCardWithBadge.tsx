import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project, MAX_DAYS_ACTIVE, activeVotingProjects } from '@/lib/mockData'
import VoteButton from './VoteButton'

interface ProjectCardWithBadgeProps {
  project: Project
  remainingVotes: number
  onVote: (projectId: string, voteCount: number) => void
  rank?: number
}

export default function ProjectCardWithBadge({ project, remainingVotes, onVote, rank }: ProjectCardWithBadgeProps) {
  const [selectedVotes, setSelectedVotes] = useState(1)
  const [showBump, setShowBump] = useState(false)
  const [prevVotes, setPrevVotes] = useState(project.votes)
  const [justVoted, setJustVoted] = useState(false)

  const handleVote = (projectId: string, voteCount: number) => {
    console.log(`+${voteCount} XP earned`)

    // Trigger vote glow effect
    setJustVoted(true)
    setTimeout(() => setJustVoted(false), 800)

    // Check for vote milestone bump (multiple of 10)
    const oldVotes = project.votes
    const newVotes = oldVotes + voteCount
    const oldMilestone = Math.floor(oldVotes / 10)
    const newMilestone = Math.floor(newVotes / 10)

    if (newMilestone > oldMilestone) {
      // Trigger bump animation
      setShowBump(true)
      setTimeout(() => setShowBump(false), 2000)

      // Increment priority score in the global state
      const projectIndex = activeVotingProjects.findIndex(p => p.id === projectId)
      if (projectIndex !== -1) {
        activeVotingProjects[projectIndex].priorityScore += 1
      }
    }

    onVote(projectId, voteCount)
  }

  // Track vote changes for bump detection
  useEffect(() => {
    setPrevVotes(project.votes)
  }, [project.votes])

  // Update selected votes if it exceeds remaining votes
  React.useEffect(() => {
    if (selectedVotes > remainingVotes && remainingVotes > 0) {
      setSelectedVotes(remainingVotes)
    }
  }, [remainingVotes, selectedVotes])

  const getBadgeColor = (day: number) => {
    if (day === 1) return 'bg-green-100 text-green-800'
    if (day <= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusBadges = () => {
    const badges = []

    // Hot badge (top 3 by votes or hot ranking)
    if (rank && rank <= 3) {
      badges.push({ text: '🔥 Hot', style: 'bg-orange-100 text-orange-800' })
    }

    // New badge (daysActive = 1)
    if (project.daysActive === 1) {
      badges.push({ text: '✨ New', style: 'bg-blue-100 text-blue-800' })
    }

    // Last chance badge (daysActive = MAX_DAYS_ACTIVE)
    if (project.daysActive === MAX_DAYS_ACTIVE) {
      badges.push({ text: '⚠️ Last Chance', style: 'bg-red-100 text-red-800' })
    }

    // Bumped badge (temporary)
    if (showBump) {
      badges.push({ text: '⬆️ Bumped', style: 'bg-purple-100 text-purple-800' })
    }

    return badges
  }

  return (
    <motion.div
      className="relative h-80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glowing gradient border */}
      <div
        className={`absolute inset-0 rounded-xl p-[1px] transition-all duration-300 ${
          showBump
            ? 'bg-gradient-to-r from-purple-500/30 via-purple-400/30 to-purple-500/30 opacity-100'
            : justVoted
            ? 'bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 opacity-100'
            : 'bg-gradient-to-r from-[#FFE500]/30 via-[#FF8C00]/30 to-[#FF4500]/30 opacity-60 hover:opacity-100'
        }`}
      >
        <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
      </div>

      <div className="relative flex flex-col p-6 h-full">
        {/* Fixed badge area in top-right corner */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <motion.span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(project.daysActive)}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Day {project.daysActive} of {MAX_DAYS_ACTIVE}
          </motion.span>
          <AnimatePresence>
            {getStatusBadges().map((badge, index) => (
              <motion.span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${badge.style}`}
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{
                  opacity: 1,
                  scale: badge.text.includes('Bumped') ? 1.1 : 1,
                  y: 0
                }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{
                  duration: badge.text.includes('Bumped') ? 0.5 : 0.3,
                  delay: 0.2 + index * 0.1,
                  type: badge.text.includes('Bumped') ? "spring" : "tween",
                  repeat: badge.text.includes('Bumped') ? 3 : 0,
                  repeatType: "reverse"
                }}
              >
                {badge.text}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Top content area - logo, name, url */}
        <div className="pr-16">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0">
              {project.isImageLogo ? (
                <img
                  src={project.logo}
                  alt={`${project.name} logo`}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-600"
                />
              ) : (
                <div className="text-4xl w-20 h-20 flex items-center justify-center">{project.logo}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">
                {project.name}
              </h3>
              <p className="text-gray-300 text-sm">${project.ticker}</p>
            </div>
          </div>

          <div className="mb-3">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFE500] hover:text-[#FF8C00] underline text-sm truncate block transition-colors duration-200"
            >
              {project.url}
            </a>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span className="text-white">{project.votes} votes</span>
            <span className="text-xs text-purple-400">
              Hot Score: {project.votes + project.priorityScore}
            </span>
          </div>

          {project.vaultedSupply !== undefined && project.vaultedSupply > 0 && (
            <div className="flex items-center gap-2 text-xs text-[#FFE500] mb-3">
              <span>🔐</span>
              <span>{project.vaultedSupply}% Vaulted Supply (30 days from TGE)</span>
            </div>
          )}
        </div>

        {/* Bottom content area - slider and vote button pinned to bottom */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-300">Votes:</label>
            <input
              type="range"
              min="1"
              max={Math.max(remainingVotes, 1)}
              value={selectedVotes}
              onChange={(e) => setSelectedVotes(Number(e.target.value))}
              disabled={remainingVotes === 0}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm font-medium text-white min-w-[20px]">
              {selectedVotes}
            </span>
            <button
              onClick={() => setSelectedVotes(remainingVotes)}
              disabled={remainingVotes === 0}
              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Max
            </button>
          </div>
          <VoteButton
            projectId={project.id}
            voteCount={selectedVotes}
            isDisabled={remainingVotes === 0}
            onVote={handleVote}
          />
        </div>
      </div>
    </motion.div>
  )
}