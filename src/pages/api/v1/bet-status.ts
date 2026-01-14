import { calculateIndividualScore } from '@/services/brazuerao.service'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method !== 'POST')
      return res.status(405).json({ message: 'Method Not Allowed' })

    const { classification }: { classification: string[] } = await req.body

    if (!classification || !Array.isArray(classification)) {
      return res.status(400).json({ error: 'Invalid body' })
    }

    const formattedClassification: string[] = removeDups(classification).filter(
      (team) => team && team.trim().length > 0
    )

    if (formattedClassification.length != 20) {
      return res.status(400).json({ error: 'Invalid body' })
    }

    const scoreResults = await calculateIndividualScore(classification)

    return res.status(200).json({ score: scoreResults })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Internal Error', error: (error as Error).message })
  }
}

const removeDups = (arr: string[]): string[] => {
  let unique: string[] = arr.reduce(function (acc: string[], curr: string) {
    if (!acc.includes(curr)) acc.push(curr)
    return acc
  }, [])
  return unique
}

export default handler
