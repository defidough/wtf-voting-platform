import React from 'react'

interface VoteButtonProps {
  projectId: string
  voteCount: number
  isDisabled: boolean
  onVote: (projectId: string, voteCount: number) => void
}

export default function VoteButton({ projectId, voteCount, isDisabled, onVote }: VoteButtonProps) {
  const handleClick = () => {
    if (!isDisabled) {
      onVote(projectId, voteCount)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-xl font-medium shadow-md transition-all duration-200
        ${isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
        }
      `}
    >
      {isDisabled ? 'No Votes Left' : `Vote (${voteCount})`}
    </button>
  )
}