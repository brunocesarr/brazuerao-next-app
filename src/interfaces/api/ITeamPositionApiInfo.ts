import { ITeamApiInfo } from './ITeamApiInfo';

export interface ITeamPositionApiInfo {
  posicao: number;
  pontos: number;
  time: ITeamApiInfo;
  jogos: number;
}