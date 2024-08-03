import { z } from 'zod'

export interface ITeamApiInfo {
  nome_popular: string
  nome: string
}

export interface Team {
  position: number
  team: string
  acronym: string
  shield: string
  popularName: string
  points: number
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  winPercentage: number
  recentResults: string[]
  positionChange: number
}

export const teamSchema = z.object({
  position: z.number(),
  team: z.string(),
  acronym: z.string(),
  shield: z.string(),
  popularName: z.string(),
  points: z.number(),
  played: z.number(),
  wins: z.number(),
  draws: z.number(),
  losses: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDifference: z.number(),
  winPercentage: z.number(),
  recentResults: z.array(z.string()),
  positionChange: z.number(),
})
