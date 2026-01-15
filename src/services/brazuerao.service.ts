import { UserUrlPhotos } from '@/configs/user-url-photos'
import { ZonesClassificationTable } from '@/configs/zones-classification-table'

import {
  IBetBrazueraoInfoUser,
  IBetUserClassification,
  ITeamPositionInfo,
} from '../interfaces'
import { getBrasileiraoTable } from '../repositories/brasileirao.repository'
import { readBrazueraoSheet } from '../repositories/google.repository'
import { groupBy, titleCaseWord } from '@/utils/helpers'

const firstPositionCorrectScore = 3
const positionCorrectScore = 2
const ZoneCorrectScore = 1

const currentFullYear = new Date().getFullYear()

function getTeamsInCorrectPositions(
  leagueTable: ITeamPositionInfo[],
  teamsOrderBet: string[]
) {
  return teamsOrderBet.filter((teamPositionInBet, index) => {
    const currentBetPositionTeam = index + 1
    const currentPositionTeam = leagueTable.find((teamInfoPosition) =>
      teamInfoPosition.nomePopular.includes(teamPositionInBet)
    )?.posicao
    return currentPositionTeam && currentPositionTeam === currentBetPositionTeam
  })
}

function getTeamsInCorrectZones(
  leagueTable: ITeamPositionInfo[],
  teamsOrderBet: string[],
  useOriginalZonesInTable: boolean
) {
  return teamsOrderBet.filter((teamPositionInBet, index) => {
    const currentBetPositionTeam = index + 1
    const currentPositionTeam = leagueTable.find((teamInfoPosition) =>
      teamInfoPosition.nomePopular.includes(teamPositionInBet)
    )?.posicao

    if (!currentPositionTeam || currentPositionTeam === currentBetPositionTeam)
      return false

    let teamIsCentralZone =
      [
        ...ZonesClassificationTable.PRE_LIBERTADORES_ZONE,
        ...ZonesClassificationTable.SULAMERICANA_ZONE,
        ...ZonesClassificationTable.NEUTRAL_ZONE,
      ].includes(currentPositionTeam as number) &&
      [
        ...ZonesClassificationTable.PRE_LIBERTADORES_ZONE,
        ...ZonesClassificationTable.SULAMERICANA_ZONE,
        ...ZonesClassificationTable.NEUTRAL_ZONE,
      ].includes(currentBetPositionTeam)

    if (useOriginalZonesInTable)
      teamIsCentralZone =
        (ZonesClassificationTable.PRE_LIBERTADORES_ZONE.includes(
          currentPositionTeam as number
        ) &&
          ZonesClassificationTable.PRE_LIBERTADORES_ZONE.includes(
            currentBetPositionTeam
          )) ||
        (ZonesClassificationTable.SULAMERICANA_ZONE.includes(
          currentPositionTeam as number
        ) &&
          ZonesClassificationTable.SULAMERICANA_ZONE.includes(
            currentBetPositionTeam
          )) ||
        (ZonesClassificationTable.NEUTRAL_ZONE.includes(
          currentPositionTeam as number
        ) &&
          ZonesClassificationTable.NEUTRAL_ZONE.includes(
            currentBetPositionTeam
          ))

    return (
      (ZonesClassificationTable.G4_ZONE.includes(
        currentPositionTeam as number
      ) &&
        ZonesClassificationTable.G4_ZONE.includes(currentBetPositionTeam)) ||
      teamIsCentralZone ||
      (ZonesClassificationTable.RELEGATION_ZONE.includes(
        currentPositionTeam as number
      ) &&
        ZonesClassificationTable.RELEGATION_ZONE.includes(
          currentBetPositionTeam
        ))
    )
  })
}

function getTeamsInCorrectPositionsWithPositionInfo(
  leagueTable: ITeamPositionInfo[],
  teamsOrderBet: string[]
) {
  return getTeamsInCorrectPositions(leagueTable, teamsOrderBet).map((item) => {
    const currentPosition = leagueTable.find(
      (teamPosition) => teamPosition.nomePopular === item
    )
    return `${item} (${currentPosition?.posicao}º)`
  })
}

function getTeamsInCorrectZonesWithPositionInfo(
  leagueTable: ITeamPositionInfo[],
  teamsOrderBet: string[],
  useOriginalZonesInTable: boolean
) {
  const teamsInCorrectZones = getTeamsInCorrectZones(
    leagueTable,
    teamsOrderBet,
    useOriginalZonesInTable
  )
  const teamsWithCurrentPositions = [
    ...leagueTable.filter((teamPosition) =>
      teamsInCorrectZones.includes(teamPosition.nomePopular)
    ),
  ]

  return teamsWithCurrentPositions.map(
    (item) => `${item.nomePopular} (${item.posicao}º)`
  )
}

async function calculateUsersBetScores(
  useOriginalZonesInTable: boolean = false,
  year: number = currentFullYear
) {
  const leagueTable: ITeamPositionInfo[] = await getBrasileiraoTable()

  const betsLeagueTable: IBetBrazueraoInfoUser[] =
    await readBrazueraoSheet(year)

  let userScores: IBetUserClassification[] = []

  const currentTeamChampion = leagueTable.at(0)?.nomePopular

  betsLeagueTable.map((betUserLeagueTable) => {
    const currentBetTeamChampion = betUserLeagueTable.classification.at(0)

    const userScoreInBet: IBetUserClassification = {
      position: 0,
      username: betUserLeagueTable.username,
      score: calculateScore(
        leagueTable,
        betUserLeagueTable.classification,
        useOriginalZonesInTable
      ),
      isCurrentChampionCorrect: currentTeamChampion === currentBetTeamChampion,
      teamsInCorrectsPositions: getTeamsInCorrectPositionsWithPositionInfo(
        leagueTable,
        betUserLeagueTable.classification
      ),
      teamsInCorrectZones: getTeamsInCorrectZonesWithPositionInfo(
        leagueTable,
        betUserLeagueTable.classification,
        useOriginalZonesInTable
      ),
    }

    userScores.push(userScoreInBet)
  })

  return reorderUserByScore(userScores)
}

async function calculateIndividualScore(
  bets: IBetBrazueraoInfoUser[],
  useOriginalZonesInTable: boolean = false
) {
  const leagueTable: ITeamPositionInfo[] = await getBrasileiraoTable(false)

  let userScores: IBetUserClassification[] = []

  const currentTeamChampion = leagueTable.at(0)?.nomePopular

  bets.map((betUserLeagueTable) => {
    const currentBetTeamChampion = betUserLeagueTable.classification.at(0)

    const userScoreInBet: IBetUserClassification = {
      position: 0,
      username: betUserLeagueTable.username,
      score: calculateScore(
        leagueTable,
        betUserLeagueTable.classification,
        useOriginalZonesInTable
      ),
      isCurrentChampionCorrect: currentTeamChampion === currentBetTeamChampion,
      teamsInCorrectsPositions: getTeamsInCorrectPositionsWithPositionInfo(
        leagueTable,
        betUserLeagueTable.classification
      ),
      teamsInCorrectZones: getTeamsInCorrectZonesWithPositionInfo(
        leagueTable,
        betUserLeagueTable.classification,
        useOriginalZonesInTable
      ),
    }

    userScores.push(userScoreInBet)
  })

  return reorderUserByScore(userScores)
}

function reorderUserByScore(userScores: IBetUserClassification[]) {
  userScores = userScores
    .sort((a, b) => {
      if (b.score > a.score) return 1
      else if (b.score < a.score) return -1
      else {
        if (b.isCurrentChampionCorrect && !a.isCurrentChampionCorrect) return 1
        else if (!b.isCurrentChampionCorrect && a.isCurrentChampionCorrect)
          return -1
        else if (
          b.teamsInCorrectsPositions.length > a.teamsInCorrectsPositions.length
        )
          return 1
        else if (
          b.teamsInCorrectsPositions.length < a.teamsInCorrectsPositions.length
        )
          return -1
        else {
          if (b.teamsInCorrectZones.length > a.teamsInCorrectZones.length)
            return 1
          else if (b.teamsInCorrectZones.length < a.teamsInCorrectZones.length)
            return -1
          else {
            if (b.username < a.username) return 1
            else if (b.username > a.username) return -1
            else return 0
          }
        }
      }
    })
    .map((userScore, index) => {
      userScore.position = index + 1
      return userScore
    })

  const userScoreGroup = groupBy(
    userScores,
    (userScore) =>
      `${userScore.score}-${userScore.teamsInCorrectsPositions.length}-${userScore.teamsInCorrectZones.length}`
  )

  return userScores.map((userScore) => {
    const minPosition = userScoreGroup[
      `${userScore.score}-${userScore.teamsInCorrectsPositions.length}-${userScore.teamsInCorrectZones.length}`
    ].sort((a, b) => a.position - b.position)[0].position
    userScore.position = minPosition
    return userScore
  })
}

function calculateScore(
  leagueTable: ITeamPositionInfo[],
  teamsOrderBet: string[],
  useOriginalZonesInTable: boolean
) {
  const currentTeamChampion = leagueTable.at(0)?.nomePopular
  const currentBetTeamChampion = teamsOrderBet.at(0)
  const isCurrentChampionCorrect =
    currentTeamChampion === currentBetTeamChampion

  let score: number = 0

  if (isCurrentChampionCorrect) score += firstPositionCorrectScore

  teamsOrderBet.forEach((teamPositionInBet, index) => {
    const currentBetPositionTeam = index + 1
    let currentPositionTeam = leagueTable.find((teamInfoPosition) =>
      teamInfoPosition.nomePopular.includes(teamPositionInBet)
    )?.posicao

    if (!currentPositionTeam) score += 0
    else if (
      currentPositionTeam > 0 &&
      currentPositionTeam === currentBetPositionTeam
    )
      score += positionCorrectScore
    else if (currentPositionTeam === 0 && !isCurrentChampionCorrect)
      score += ZoneCorrectScore
    else if (
      ZonesClassificationTable.G4_ZONE.includes(
        currentPositionTeam as number
      ) &&
      ZonesClassificationTable.G4_ZONE.includes(currentBetPositionTeam)
    )
      score += ZoneCorrectScore
    else if (
      !useOriginalZonesInTable &&
      [
        ...ZonesClassificationTable.PRE_LIBERTADORES_ZONE,
        ...ZonesClassificationTable.SULAMERICANA_ZONE,
        ...ZonesClassificationTable.NEUTRAL_ZONE,
      ].includes(currentPositionTeam as number) &&
      [
        ...ZonesClassificationTable.PRE_LIBERTADORES_ZONE,
        ...ZonesClassificationTable.SULAMERICANA_ZONE,
        ...ZonesClassificationTable.NEUTRAL_ZONE,
      ].includes(currentBetPositionTeam)
    )
      score += ZoneCorrectScore
    else if (
      useOriginalZonesInTable &&
      ZonesClassificationTable.PRE_LIBERTADORES_ZONE.includes(
        currentPositionTeam as number
      ) &&
      ZonesClassificationTable.PRE_LIBERTADORES_ZONE.includes(
        currentBetPositionTeam
      )
    )
      score += ZoneCorrectScore
    else if (
      useOriginalZonesInTable &&
      ZonesClassificationTable.SULAMERICANA_ZONE.includes(
        currentPositionTeam as number
      ) &&
      ZonesClassificationTable.SULAMERICANA_ZONE.includes(
        currentBetPositionTeam
      )
    )
      score += ZoneCorrectScore
    else if (
      useOriginalZonesInTable &&
      ZonesClassificationTable.NEUTRAL_ZONE.includes(
        currentPositionTeam as number
      ) &&
      ZonesClassificationTable.NEUTRAL_ZONE.includes(currentBetPositionTeam)
    )
      score += ZoneCorrectScore
    else if (
      ZonesClassificationTable.RELEGATION_ZONE.includes(
        currentPositionTeam as number
      ) &&
      ZonesClassificationTable.RELEGATION_ZONE.includes(currentBetPositionTeam)
    )
      score += ZoneCorrectScore
  })

  return score
}

function generateTableRowsBrazuerao(
  usersClassificationBrazuerao: IBetUserClassification[]
) {
  return usersClassificationBrazuerao.map((betClassificationUser, index) => {
    const {
      score,
      username,
      isCurrentChampionCorrect,
      teamsInCorrectsPositions,
      teamsInCorrectZones,
    } = betClassificationUser
    return generateRowOfTableBrazuerao(
      index + 1,
      username,
      score,
      isCurrentChampionCorrect,
      teamsInCorrectsPositions,
      teamsInCorrectZones
    )
  })
}

function generateRowOfTableBrazuerao(
  position: number,
  name: string,
  score: number,
  isCurrentChampionCorrect: boolean,
  teamsInCorrectPosition: string[],
  teamsInCorrectZone: string[]
) {
  const { length: numberOfTeamsInCorrectPosition } = teamsInCorrectPosition
  const { length: numberOfTeamsInCorrectZone } = teamsInCorrectZone

  return {
    position,
    name,
    score,
    isCurrentChampionCorrect,
    numberOfTeamsInCorrectPosition,
    numberOfTeamsInCorrectZone,
    userStatus: [
      {
        description: 'Times em Posições Corretas',
        count: numberOfTeamsInCorrectPosition,
        value: teamsInCorrectPosition.join(', '),
      },
      {
        description: 'Times em Zonas Corretas',
        count: numberOfTeamsInCorrectZone,
        value: teamsInCorrectZone.join(', '),
      },
    ],
  }
}

function getUrlPhotoUrl(username: string) {
  username = username.toLowerCase()
  switch (username) {
    case 'anderson':
      return UserUrlPhotos.ANDERSON_PHOTO_URL
    case 'ailton':
      return UserUrlPhotos.AILTON_PHOTO_URL
    case 'bruno':
      return UserUrlPhotos.BRUNO_PHOTO_URL
    case 'lucas':
      return UserUrlPhotos.LUCAS_PHOTO_URL
    case 'dedé':
      return UserUrlPhotos.DEDE_PHOTO_URL
    case 'diego':
      return UserUrlPhotos.DIEGO_PHOTO_URL
    case 'amanda':
      return UserUrlPhotos.AMANDA_PHOTO_URL
    case 'eduarda':
      return UserUrlPhotos.EDUARDA_PHOTO_URL
    case 'ellen':
      return UserUrlPhotos.ELLEN_PHOTO_URL
    case 'kamilla':
      return UserUrlPhotos.KAMILLA_PHOTO_URL
    default:
      return ''
  }
}

function getDisplayName(username: string) {
  username = username.toLowerCase()
  switch (username) {
    case 'diego':
      return 'LP da Shopee'
    default:
      return titleCaseWord(username)
  }
}

function getLastUserScores(usersScore: IBetUserClassification[]) {
  const menUsers = ['anderson', 'ailton', 'bruno', 'lucas', 'dedé', 'diego']
  const womenUsers = ['amanda', 'ellen', 'eduarda', 'kamilla']
  const lastPositionMen = usersScore.findLast((userScore) =>
    menUsers.some((username) => username === userScore.username.toLowerCase())
  )?.position
  const lastPositionWomen = usersScore.findLast((userScore) =>
    womenUsers.some((username) => username === userScore.username.toLowerCase())
  )?.position
  const lastUserScores = [
    ...usersScore.filter(
      (userScore) =>
        menUsers.some(
          (username) => username === userScore.username.toLowerCase()
        ) && userScore.position === lastPositionMen
    ),
    ...usersScore.filter(
      (userScore) =>
        womenUsers.some(
          (username) => username === userScore.username.toLowerCase()
        ) && userScore.position === lastPositionWomen
    ),
  ]
  return lastUserScores
}

async function getBrazilianTable() {
  const brazilianLeague: ITeamPositionInfo[] = await getBrasileiraoTable()

  return brazilianLeague ?? []
}

async function getBrazueraoTableByUser(
  username: string,
  year: number = currentFullYear
) {
  const betsLeagueTable: IBetBrazueraoInfoUser[] =
    await readBrazueraoSheet(year)

  const brazueraoTable = betsLeagueTable.find((betLeagueTable) => {
    return betLeagueTable.username
      .toUpperCase()
      .includes(username.toUpperCase())
  })

  return brazueraoTable?.classification ?? []
}

export {
  calculateUsersBetScores,
  calculateIndividualScore,
  generateTableRowsBrazuerao,
  generateRowOfTableBrazuerao,
  getUrlPhotoUrl,
  getDisplayName,
  getLastUserScores,
  getBrazilianTable,
  getBrazueraoTableByUser,
  getTeamsInCorrectZones,
}
