import { LocalStorageKeysCache } from '@/configs'
import { IBetBrazueraoInfoUser } from '@/interfaces'
import localStorageService from '@/services/localStorage.service'
import { sheets_v4 } from 'googleapis'

import apiGoogleSheet from './base/apiGoogleSheet'
import { getBrasileiraoTeamsNames } from './brasileirao.repository'

async function readBrazueraoSheet() {
  try {
    let betBrazueraoInfoUsers: IBetBrazueraoInfoUser[] =
      localStorageService.getItem(
        LocalStorageKeysCache.GOOGLE_SHEET_SERVICE_GET_BRAZUERAO
      )

    if (betBrazueraoInfoUsers && betBrazueraoInfoUsers.length > 0)
      return betBrazueraoInfoUsers

    const { data: brazueraoSheet } =
      await apiGoogleSheet.get<sheets_v4.Schema$ValueRange>('/api/sheets')

    if (!brazueraoSheet) throw 'Planilha não encontrada!'

    const rows = brazueraoSheet.values
    if (!rows || rows.length === 0) throw 'Planilha vazia!'

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

    betBrazueraoInfoUsers = await Promise.all(
      betBrazueraoInfoUsers.map(async (betBrazueraoInfoUser) => {
        const { teamsClassification } = betBrazueraoInfoUser
        betBrazueraoInfoUser.teamsClassification = await formatTeamsNames(
          teamsClassification
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

async function formatTeamsNames(teamsNames: string[]): Promise<string[]> {
  return await Promise.all(
    teamsNames.map(async (teamName) => await formatTeamName(teamName))
  )
}

async function formatTeamName(nameTeam: string) {
  try {
    const teams = await getBrasileiraoTeamsNames()

    if (!teams) throw new Error('Nenhuma equipe encontrada')

    let formattedNameTeam
    if (nameTeam.toLocaleLowerCase().includes('galo'))
      formattedNameTeam = 'Atlético-MG'.toUpperCase()
    else
      formattedNameTeam = teams.find((team) =>
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
