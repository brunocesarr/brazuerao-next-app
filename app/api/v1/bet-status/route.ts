import { IBetBrazueraoInfoUser } from '@/interfaces'
import { calculateIndividualScore } from '@/services/brazuerao.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Bet status API is running' })
}

export async function POST(request: NextRequest) {
  try {
    const { bets }: { bets: IBetBrazueraoInfoUser[] } = await request.json()

    if (
      !bets ||
      !Array.isArray(bets) ||
      bets.length <= 0 ||
      !isValidBody(bets)
    ) {
      return NextResponse.json(
        { error: 'Invalid body' },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // or specific origin
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }

    const scoreResults = await calculateIndividualScore(bets)

    return NextResponse.json({
      scores: scoreResults,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // or specific origin
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error(error)
    NextResponse.json(
      { message: 'Internal Error', error: (error as Error).message },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // or specific origin
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
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
