import { LocalStorageKeysCache } from '@/configs'
import { IBetBrazueraoInfoUser } from '@/interfaces'
import localStorageService from '@/services/localStorage.service'
import { sheets_v4 } from 'googleapis'

import apiGoogleSheet from './base/apiGoogleSheet'
import { getBrasileiraoTeamsNames } from './brasileirao.repository'

async function readBrazueraoSheet(year: number) {
  try {
    let betBrazueraoInfoUsers: IBetBrazueraoInfoUser[] =
      localStorageService.getItem(
        LocalStorageKeysCache.GOOGLE_SHEET_SERVICE_GET_BRAZUERAO
      )

    if (betBrazueraoInfoUsers && betBrazueraoInfoUsers.length > 0)
      return betBrazueraoInfoUsers

    const { data: brazueraoSheet } =
      await apiGoogleSheet.get<sheets_v4.Schema$ValueRange>(
        `/api/v1/brazuerao-league/${year}`
      )

    if (!brazueraoSheet) throw 'Sheet no found!'

    const rows = brazueraoSheet.values
    if (!rows || rows.length === 0) throw 'Empty Sheet!'

    betBrazueraoInfoUsers = []
    const betNumPlayers = rows[0].length
    for (let index = 0; index < betNumPlayers; index++) {
      const teamsPositionsTable = rows.slice(1, rows.length)
      const betTeamsInfoUser: IBetBrazueraoInfoUser = {
        name: `${rows[0][index]}`,
        teamsClassification: teamsPositionsTable.map((row) => `${row[index]}`),
      }
      betBrazueraoInfoUsers.push(betTeamsInfoUser)
    }

    const teams = await getBrasileiraoTeamsNames()
    if (!teams || teams.length === 0)
      throw new Error('Brazilian league teams not found')

    betBrazueraoInfoUsers = await Promise.all(
      betBrazueraoInfoUsers.map(async (betBrazueraoInfoUser) => {
        const { teamsClassification } = betBrazueraoInfoUser
        betBrazueraoInfoUser.teamsClassification = await formatTeamsNames(
          teamsClassification,
          teams
        )
        return betBrazueraoInfoUser
      })
    )

    localStorageService.setItem('brazuerao-table', betBrazueraoInfoUsers)

    return betBrazueraoInfoUsers
  } catch (error) {
    console.error(
      `The API returned an error. Message: ${(error as Error).message}`
    )
    throw error
  }
}

async function formatTeamsNames(
  teamsNames: string[],
  correctTeams: string[]
): Promise<string[]> {
  return await Promise.all(
    teamsNames.map(
      async (teamName) => await formatTeamName(teamName, correctTeams)
    )
  )
}

async function formatTeamName(nameTeam: string, correctTeams: string[]) {
  try {
    let formattedNameTeam
    if (
      ['galo', 'atlético/mg'].some(
        (alternativeName) => alternativeName === nameTeam.toLowerCase()
      )
    )
      formattedNameTeam = 'Atlético-MG'.toUpperCase()
    else if (
      ['fatal model vitória #tadala'].some(
        (alternativeName) => alternativeName === nameTeam.toLowerCase()
      )
    )
      formattedNameTeam = 'Vitória'.toUpperCase()
    else if (
      ['atlético/go'].some(
        (alternativeName) => alternativeName === nameTeam.toLowerCase()
      )
    )
      formattedNameTeam = 'Atlético-GO'.toUpperCase()
    else
      formattedNameTeam = correctTeams.find((team) =>
        nameTeam
          .split(' ')
          .every((nameTeam) =>
            team.toLowerCase().includes(nameTeam.toLocaleLowerCase())
          )
      )

    return formattedNameTeam as string
  } catch (error) {
    console.error(`Format error. Error: ${error}`)
    throw error
  }
}

export { readBrazueraoSheet }
