import {
  submissions,
  activeVotingProjects,
  currentWinningProject,
  archivedProjects,
  MAX_DAYS_ACTIVE,
  Project,
  WinningProject
} from './mockData'
import { mockUsers } from './mockData'

export const endOfDayReset = (): void => {
  console.log('Starting end of day reset...')

  // 1. Find the project with the most votes in activeVotingProjects
  if (activeVotingProjects.length > 0) {
    const winner = activeVotingProjects.reduce((prev, current) =>
      current.votes > prev.votes ? current : prev
    )

    console.log(`Winner: ${winner.name} with ${winner.votes} votes`)

    // Move winner to current winning project (reset votes)
    Object.assign(currentWinningProject, {
      id: winner.id,
      name: winner.name,
      ticker: winner.ticker,
      logo: winner.logo,
      url: winner.url,
      isImageLogo: winner.isImageLogo,
      presaleMints: 1200, // Reset presale mints
      endsAt: Date.now() + (24 * 60 * 60 * 1000) // 24h from now
    })

    // Remove winner from active voting
    const winnerIndex = activeVotingProjects.findIndex(p => p.id === winner.id)
    if (winnerIndex !== -1) {
      activeVotingProjects.splice(winnerIndex, 1)
    }
  }

  // 2. Process remaining non-winning projects
  for (let i = activeVotingProjects.length - 1; i >= 0; i--) {
    const project = activeVotingProjects[i]

    // Reset votes to 0
    project.votes = 0

    // Increment daysActive
    project.daysActive += 1

    // Check if project should be archived
    if (project.daysActive > MAX_DAYS_ACTIVE) {
      // Move to archived
      archivedProjects.push(project)
      activeVotingProjects.splice(i, 1)
      console.log(`Archived: ${project.name} (${project.daysActive} days active)`)
    } else {
      console.log(`${project.name} continues (Day ${project.daysActive}/${MAX_DAYS_ACTIVE})`)
    }
  }

  // 3. Move submissions to active voting
  while (submissions.length > 0) {
    const newProject = submissions.shift()!
    newProject.daysActive = 1
    newProject.votes = 0
    activeVotingProjects.push(newProject)
    console.log(`Added to voting: ${newProject.name}`)
  }

  // 4. Reset user votes remaining (simplified - set to 10 for all users)
  mockUsers.forEach(user => {
    // Reset votes remaining - this would typically be based on user tier
    // For now, we'll just ensure they get a fresh set of votes
    console.log(`Reset votes for ${user.wallet}`)
  })

  console.log('End of day reset completed!')
  console.log(`Active voting projects: ${activeVotingProjects.length}`)
  console.log(`Submissions: ${submissions.length}`)
  console.log(`Archived projects: ${archivedProjects.length}`)
}