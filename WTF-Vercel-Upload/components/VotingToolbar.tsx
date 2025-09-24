import React from 'react'

export type SortOption = 'votes' | 'hot' | 'newest' | 'ending' | 'random'

interface VotingToolbarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  totalProjects: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function VotingToolbar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  totalProjects,
  currentPage,
  totalPages,
  onPageChange
}: VotingToolbarProps) {
  const sortOptions = [
    { value: 'votes' as SortOption, label: 'Most Votes' },
    { value: 'hot' as SortOption, label: 'Hot' },
    { value: 'newest' as SortOption, label: 'Newest' },
    { value: 'ending' as SortOption, label: 'Ending Soon' },
    { value: 'random' as SortOption, label: 'Random' }
  ]

  return (
    <div className="relative mb-6">
      {/* Glowing gradient border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/20 via-[#FF8C00]/20 to-[#FF4500]/20 p-[1px]">
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-black/95 via-gray-900/95 to-purple-900/30 backdrop-blur-sm" />
      </div>

      <div className="relative p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search projects by name, ticker, or builder wallet..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="px-3 py-2 bg-black/40 border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-[#FFE500] transition-colors duration-200"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <span className="text-sm text-gray-400">
              {totalProjects} project{totalProjects !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded-md text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors duration-200"
            >
              Previous
            </button>

            <span className="px-3 py-1 text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded-md text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}