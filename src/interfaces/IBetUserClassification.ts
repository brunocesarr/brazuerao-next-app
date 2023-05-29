export interface IBetUserClassification {
  position: number;
  username: string;
  score: number;
  isCurrentChampionCorrect: boolean;
  teamsInCorrectsPositions: string[];
  teamsInCorrectZones: string[];
}