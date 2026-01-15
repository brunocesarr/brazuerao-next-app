import { IBetBrazueraoInfoUser } from '@/interfaces'
import { calculateIndividualScore } from '@/services/brazuerao.service'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method !== 'POST')
      return res.status(405).json({ message: 'Method Not Allowed' })

    const { bets }: { bets: IBetBrazueraoInfoUser[] } = await req.body

    if (
      !bets ||
      !Array.isArray(bets) ||
      bets.length <= 0 ||
      !isValidBody(bets)
    ) {
      return res.status(400).json({ error: 'Invalid body' })
    }

    const scoreResults = await calculateIndividualScore(bets)

    return res.status(200).json({ scores: scoreResults })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Internal Error', error: (error as Error).message })
  }
}

const isValidBody = (bets: IBetBrazueraoInfoUser[]): boolean => {
  if (!bets || !Array.isArray(bets) || bets.length <= 0) return false
  for (let bet of bets) {
    if (
      !bet.username ||
      typeof bet.username !== 'string' ||
      !bet.classification ||
      !Array.isArray(bet.classification) ||
      removeDups(bet.classification).length !== 20
    ) {
      return false
    }
  }
  return true
}

const removeDups = (arr: string[]): string[] => {
  let unique: string[] = arr.reduce(function (acc: string[], curr: string) {
    if (!acc.includes(curr)) acc.push(curr)
    return acc
  }, [])
  return unique
}

export default handler
