import { z } from 'zod'

export interface IBetUserClassification {
  position: number
  username: string
  score: number
  isCurrentChampionCorrect: boolean
  teamsInCorrectsPositions: string[]
  teamsInCorrectZones: string[]
}

export const IBetUserClassificationSchema = z.object({
  position: z.number(),
  username: z.string(),
  score: z.number(),
  isCurrentChampionCorrect: z.boolean(),
  teamsInCorrectsPositions: z.array(z.string()),
  teamsInCorrectZones: z.array(z.string()),
})
