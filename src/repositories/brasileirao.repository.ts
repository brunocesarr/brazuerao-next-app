import { LocalStorageKeysCache } from '@/configs';
import localStorageService from '@/services/localStorage.service';

import { ITeamPositionApiInfo, ITeamPositionInfo } from '../interfaces';
import apiBrasileiraoGloboEsporte from './base/apiBrasileiraoGloboEsporte';
import apiFutebol from './base/apiFutebol';

async function getBrasileiraoTeamsNames(): Promise<string[] | undefined> {
  try {
    const leagueTable = await getBrasileiraoTable()

    if (!leagueTable) throw new Error('Times do Brasileirão não encontrados.')

    return leagueTable.map((data) => data.nomePopular.toUpperCase())
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getBrasileiraoTable(): Promise<ITeamPositionInfo[]> {
  try {
    let leagueTableData: ITeamPositionInfo[] = localStorageService.getItem(
      LocalStorageKeysCache.BRASILEIRAO_LEAGUE_SERVICE_GET_TABLE
    )

    if (leagueTableData && leagueTableData.length > 0) return leagueTableData

    const leagueTable = await getBrasilianLeague()

    if (!leagueTable)
      throw new Error('Dados da tabela do Brasileirão não encontrado.')

    leagueTableData = leagueTable.map((data) => {
      const { posicao, pontos, time, jogos } = data
      return {
        posicao,
        pontos,
        nomePopular: time.nome_popular.toUpperCase(),
        jogos,
      } as ITeamPositionInfo
    })

    localStorageService.setItem('brazileirao-table', leagueTableData)

    return leagueTableData
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getBrasilianLeague() {
  let brasilianLeagueTableApiInfo: ITeamPositionApiInfo[] = []
  let errorMessage = ''

  try {
    brasilianLeagueTableApiInfo = await getBrasilianLeagueGE()
  } catch (error) {
    errorMessage = `${(error as Error).message}`
  }

  if (brasilianLeagueTableApiInfo && brasilianLeagueTableApiInfo.length > 0)
    return brasilianLeagueTableApiInfo

  try {
    brasilianLeagueTableApiInfo = await getBrasilianLeagueApiFutebol()
    return brasilianLeagueTableApiInfo
  } catch (error) {
    console.error(
      `Error in API Futebol. Erro message: ${(error as Error).message}`
    )
    errorMessage = `${errorMessage}. ${(error as Error).message}`
    throw new Error(errorMessage)
  }
}

async function getBrasilianLeagueGE() {
  try {
    const { data: brasilianLeagueApiGE } = await apiBrasileiraoGloboEsporte.get<
      any[]
    >('/api/brazilian-league')

    return brasilianLeagueApiGE.map((teamPositionInfo) => {
      const teamPositionApiInfo: ITeamPositionApiInfo = {
        posicao: teamPositionInfo.position,
        jogos: teamPositionInfo.played,
        time: {
          nome_popular: teamPositionInfo.popularName,
          nome: teamPositionInfo.team,
        },
        pontos: teamPositionInfo.points,
      }

      return teamPositionApiInfo
    })
  } catch (error) {
    console.error(
      `Error in API Brasileirao GloboEsporte. Erro message: ${
        (error as Error).message
      }`
    )
    const errorMessage = `API Brasileirao GloboEsporte: ${
      (error as Error).message
    }`
    throw new Error(errorMessage)
  }
}

async function getBrasilianLeagueApiFutebol() {
  try {
    const { data: brasilianLeagueApiFutebol } = await apiFutebol.get<
      ITeamPositionApiInfo[]
    >('/v1/campeonatos/10/tabela')

    if (!brasilianLeagueApiFutebol || brasilianLeagueApiFutebol.length === 0)
      return []

    return brasilianLeagueApiFutebol
  } catch (error) {
    console.error(
      `Error in API Futebol. Erro message: ${(error as Error).message}`
    )
    const errorMessage = `API Futebol: ${(error as Error).message}`
    throw new Error(errorMessage)
  }
}

export { getBrasileiraoTable, getBrasileiraoTeamsNames }
