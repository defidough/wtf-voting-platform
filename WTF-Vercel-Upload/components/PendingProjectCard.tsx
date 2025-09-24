import React from 'react'
import { Project } from '@/lib/mockData'

interface PendingProjectCardProps {
  project: Project
}

export default function PendingProjectCard({ project }: PendingProjectCardProps) {
  return (
    <div className="relative">
      {/* Glowing gradient border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE500]/20 via-[#FF8C00]/20 to-[#FF4500]/20 p-[1px]">
        <div className="w-full h-full rounded-xl bg-black/90 backdrop-blur-sm" />
      </div>

      <div className="relative p-6 hover:bg-black/5 transition-colors duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-4">
              {project.isImageLogo ? (
                <img
                  src={project.logo}
                  alt={`${project.name} logo`}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-600"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFE500]/20 to-[#FF8C00]/20 rounded-xl border border-gray-600 flex items-center justify-center text-3xl">
                  {project.logo}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{project.name}</h3>
              <p className="text-gray-300">${project.ticker}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FFE500] hover:text-[#FF8C00] underline transition-colors duration-200"
          >
            {project.url}
          </a>
        </div>

        {project.vaultedSupply !== undefined && project.vaultedSupply > 0 && (
          <div className="flex items-center gap-2 text-xs text-[#FFE500] mb-3">
            <span>🔐</span>
            <span>{project.vaultedSupply}% Vaulted Supply (30 days from TGE)</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Pending voting</span>
          <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded-full text-xs border border-yellow-600">
            Submitted
          </span>
        </div>
      </div>
    </div>
  )
}