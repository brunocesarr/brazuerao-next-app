import { UserUrlPhotos } from '@/configs/user-url-photos';

import { IBetBrazueraoInfoUser, IBetUserClassification, ITeamPositionInfo } from '../interfaces';
import { getBrasileiraoTable } from '../repositories/brasileirao.repository';
import { readBrazueraoSheet } from '../repositories/google.repository';

const firstPositionCorrectScore = 3;
const positionCorrectScore = 2;
const ZoneCorrectScore = 1;

const G4Zone = [1, 2, 3, 4];
const SulamericanaZone = [5, 6, 7, 8, 9, 10, 11, 12];
const NeutralZone = [13, 14, 15, 16];
const RelegationZone = [17, 18, 19, 20];

function getTeamsInCorrectPositions(leagueTable: ITeamPositionInfo[], teamsOrderBet: string[]) {
  return teamsOrderBet.filter((teamPositionInBet, index) => {
    const currentBetPositionTeam = index + 1;
    const currentPositionTeam = leagueTable.find(teamInfoPosition => teamInfoPosition.nomePopular.includes(teamPositionInBet))?.posicao;
    return currentPositionTeam && currentPositionTeam === currentBetPositionTeam;
  });
}

function getTeamsInCorrectZones(leagueTable: ITeamPositionInfo[], teamsOrderBet: string[]) {
  return teamsOrderBet.filter((teamPositionInBet, index) => {
    const currentBetPositionTeam = index + 1;
    const currentPositionTeam = leagueTable.find(teamInfoPosition => teamInfoPosition.nomePopular.includes(teamPositionInBet))?.posicao;

    if (!currentPositionTeam || currentPositionTeam === currentBetPositionTeam)
      return false;

    return (G4Zone.includes(currentPositionTeam as number) && G4Zone.includes(currentBetPositionTeam))
      || ((SulamericanaZone.includes(currentPositionTeam as number) && SulamericanaZone.includes(currentBetPositionTeam))
      || (NeutralZone.includes(currentPositionTeam as number) && NeutralZone.includes(currentBetPositionTeam)))
      || (RelegationZone.includes(currentPositionTeam as number) && RelegationZone.includes(currentBetPositionTeam));
  });
}

function getTeamsInCorrectPositionsWithPositionInfo(leagueTable: ITeamPositionInfo[], teamsOrderBet: string[]) {
  return getTeamsInCorrectPositions(leagueTable, teamsOrderBet).map(item => {
    const currentPosition = leagueTable.findIndex(teamPosition => teamPosition.nomePopular === item); 
    return `${item} (${currentPosition + 1}º)`;
  })
}

function getTeamsInCorrectZonesWithPositionInfo(leagueTable: ITeamPositionInfo[], teamsOrderBet: string[]) {
  return getTeamsInCorrectZones(leagueTable, teamsOrderBet).map(item => {
    const currentPosition = leagueTable.findIndex(teamPosition => teamPosition.nomePopular === item); 
    return `${item} (${currentPosition + 1}º)`;
  })
}

async function calculateUsersBetScores() {
  const leagueTable : ITeamPositionInfo[] = await getBrasileiraoTable();

  const betsLeagueTable : IBetBrazueraoInfoUser[] = await readBrazueraoSheet();

  let userScores : IBetUserClassification[] = [];
  
  const currentTeamChampion = leagueTable.at(0)?.nomePopular;
  
  betsLeagueTable.map(betUserLeagueTable => {
    const currentBetTeamChampion = betUserLeagueTable.teamsClassification.at(0);

    const userScoreInBet : IBetUserClassification = {
      position: 0,
      username: betUserLeagueTable.name,
      score: calculateScore(leagueTable, betUserLeagueTable.teamsClassification),
      isCurrentChampionCorrect: currentTeamChampion === currentBetTeamChampion,
      teamsInCorrectsPositions: getTeamsInCorrectPositionsWithPositionInfo(leagueTable, betUserLeagueTable.teamsClassification),
      teamsInCorrectZones: getTeamsInCorrectZonesWithPositionInfo(leagueTable, betUserLeagueTable.teamsClassification),
    } 
    
    userScores.push(userScoreInBet);
  });
  
  return userScores
    .sort((a, b) =>  {
      if(b.score > a.score)
        return 1;
      else if (b.score < a.score)
        return -1;
      else {
        if(b.teamsInCorrectsPositions.length > a.teamsInCorrectsPositions.length)
          return 1;
        else if (b.teamsInCorrectsPositions.length < a.teamsInCorrectsPositions.length)
          return -1;
        else {
          if(b.teamsInCorrectZones.length > a.teamsInCorrectZones.length)
            return 1;
          else if (b.teamsInCorrectZones.length < a.teamsInCorrectZones.length)
            return -1;
          else {
            if(b.username < a.username)
              return 1;
            else if (b.username > a.username)
              return -1;
            else 
              return 0;
          }
        }
      }
    })  
    .map((userScore, index) => {
      userScore.position = index + 1;
      return userScore; 
    });
}

function calculateScore(leagueTable: ITeamPositionInfo[], teamsOrderBet: string[]){
  const currentTeamChampion = leagueTable.at(0)?.nomePopular;
  const currentBetTeamChampion = teamsOrderBet.at(0);
  const isCurrentChampionCorrect = currentTeamChampion === currentBetTeamChampion;

  let score: number = 0;

  if (isCurrentChampionCorrect)
    score += firstPositionCorrectScore;
  
  teamsOrderBet.forEach((teamPositionInBet, index) => {
    const currentBetPositionTeam = index + 1;
    let currentPositionTeam = leagueTable.find(teamInfoPosition => teamInfoPosition.nomePopular.includes(teamPositionInBet))?.posicao;
    
    if (!currentPositionTeam)
      score += 0;
    else if (currentPositionTeam > 0 && currentPositionTeam === currentBetPositionTeam)
      score += positionCorrectScore;
    else if (currentPositionTeam === 0 && !isCurrentChampionCorrect)
      score += ZoneCorrectScore;
    else if (G4Zone.includes(currentPositionTeam as number) && G4Zone.includes(currentBetPositionTeam))
      score += ZoneCorrectScore;
    else if ((SulamericanaZone.includes(currentPositionTeam as number) && SulamericanaZone.includes(currentBetPositionTeam))
      || (NeutralZone.includes(currentPositionTeam as number) && NeutralZone.includes(currentBetPositionTeam)))
      score += ZoneCorrectScore;
    else if (RelegationZone.includes(currentPositionTeam as number) && RelegationZone.includes(currentBetPositionTeam))
      score += ZoneCorrectScore;  
  });

  return score;
}

function generateTableRowsBrazuerao(usersClassificationBrazuerao: IBetUserClassification[]) {
  return usersClassificationBrazuerao.map((betClassificationUser, index) => {
    const { score, username, isCurrentChampionCorrect, teamsInCorrectsPositions, teamsInCorrectZones } = betClassificationUser;
    return generateRowOfTableBrazuerao(index + 1, username, score, isCurrentChampionCorrect, teamsInCorrectsPositions, teamsInCorrectZones);
  })
}

function generateRowOfTableBrazuerao(
  position: number,
  name: string,
  score: number,
  isCurrentChampionCorrect: boolean,
  teamsInCorrectPosition: string[],
  teamsInCorrectZone: string[],
) {
  const { length: numberOfTeamsInCorrectPosition } = teamsInCorrectPosition;
  const { length: numberOfTeamsInCorrectZone } = teamsInCorrectZone;

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
        value: teamsInCorrectPosition.join(", "),
      },
      {
        description: 'Times em Zonas Corretas',
        count: numberOfTeamsInCorrectZone,
        value: teamsInCorrectZone.join(", "),
      },
    ],
  };
}

function getUrlPhotoUrl(username: string){
  switch (username) {
    case 'Anderson':
      return UserUrlPhotos.ANDERSON_PHOTO_URL;
    case 'Ailton':
      return UserUrlPhotos.AILTON_PHOTO_URL;
    case 'Bruno':
      return UserUrlPhotos.BRUNO_PHOTO_URL;
    case 'Lucas':
      return UserUrlPhotos.LUCAS_PHOTO_URL;
    case 'Dedé':
      return UserUrlPhotos.DEDE_PHOTO_URL;
    default:
      return '';
  }
}

export {
  calculateUsersBetScores,
  generateTableRowsBrazuerao,
  generateRowOfTableBrazuerao,
  getUrlPhotoUrl,
}
