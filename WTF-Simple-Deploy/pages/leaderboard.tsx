import React from 'react'
import LeaderboardTable from '@/components/LeaderboardTable'
import { endOfDayReset } from '@/lib/lifecycle'

export default function Leaderboard() {
  const handleManualReset = () => {
    if (confirm('Are you sure you want to simulate the daily reset? This will move projects between phases and reset votes.')) {
      endOfDayReset()
      // Refresh the page to show updated data
      window.location.reload()
    }
  }

  return (
    <>
      <main className="flex-1 pt-32 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00]">WTF Leaderboards</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Track the most active WTF participants by XP earned through voting, presale minting, and project submissions inside the platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/50">
                <span className="text-gray-300">Compete for</span>
                <span className="font-bold text-[#FFE500]">WTF Rewards</span>
                <span className="text-gray-300">& Recognition</span>
              </div>
              <button
                onClick={handleManualReset}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-full hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
              >
                Simulate Daily Reset
              </button>
            </div>
          </div>

          <LeaderboardTable />
        </div>
      </main>
    </>
  )
}