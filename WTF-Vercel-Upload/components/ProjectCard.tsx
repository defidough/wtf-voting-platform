import React, { useState } from 'react'
import { Project } from '@/lib/mockData'
import VoteButton from './VoteButton'

interface ProjectCardProps {
  project: Project
  remainingVotes: number
  onVote: (projectId: string, voteCount: number) => void
}

export default function ProjectCard({ project, remainingVotes, onVote }: ProjectCardProps) {
  const [selectedVotes, setSelectedVotes] = useState(1)

  const handleVote = (projectId: string, voteCount: number) => {
    console.log(`+${voteCount} XP earned`)
    onVote(projectId, voteCount)
  }

  // Update selected votes if it exceeds remaining votes
  React.useEffect(() => {
    if (selectedVotes > remainingVotes && remainingVotes > 0) {
      setSelectedVotes(remainingVotes)
    }
  }, [remainingVotes, selectedVotes])

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="mr-3">
            {project.isImageLogo ? (
              <img
                src={project.logo}
                alt={`${project.name} logo`}
                className="w-16 h-16 object-cover rounded-xl border"
              />
            ) : (
              <div className="text-3xl">{project.logo}</div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
            <p className="text-gray-600">${project.ticker}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {project.url}
        </a>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{project.votes} votes</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Votes:</label>
          <input
            type="range"
            min="1"
            max={Math.max(remainingVotes, 1)}
            value={selectedVotes}
            onChange={(e) => setSelectedVotes(Number(e.target.value))}
            disabled={remainingVotes === 0}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-sm font-medium text-gray-900 min-w-[20px]">
            {selectedVotes}
          </span>
          <button
            onClick={() => setSelectedVotes(remainingVotes)}
            disabled={remainingVotes === 0}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
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
  )
}