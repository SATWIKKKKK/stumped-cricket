export type ProviderMatch = {
  externalId: string;
  status: "LIVE" | "UPCOMING" | "COMPLETED";
  tournament: string;
  format: string;
  team1: string;
  team1Code: string;
  score1: string;
  overs1: string;
  team2: string;
  team2Code: string;
  score2: string;
  overs2: string;
  venue: string;
  result: string;
  startTimeUtc?: string;
  sourceUpdatedAt?: string;
  raw?: unknown;
};

export type ProviderPlayer = {
  externalId: string;
  name: string;
  team: string;
  country: string;
  format: string;
  ranking: string;
  status: string;
  score: number;
  tier: string;
  role: string;
  sourceUpdatedAt?: string;
  raw?: unknown;
};

export type ProviderTeam = {
  externalId: string;
  name: string;
  code: string;
  league: string;
  country: string;
  ranking: string;
  wins: number;
  losses: number;
  nrr: string;
  captain: string;
  players: number;
  sourceUpdatedAt?: string;
  raw?: unknown;
};

export type ProviderRanking = {
  externalId: string;
  player: string;
  country: string;
  format: string;
  rating: number;
  type: string;
  sourceUpdatedAt?: string;
  raw?: unknown;
};

export type ProviderNews = {
  externalId: string;
  tag: string;
  title: string;
  summary: string;
  time: string;
  reads: string;
  sourceUpdatedAt?: string;
  raw?: unknown;
};

export type CricketProviderSnapshot = {
  matches: ProviderMatch[];
  players: ProviderPlayer[];
  teams: ProviderTeam[];
  rankings: ProviderRanking[];
  news: ProviderNews[];
};

export interface CricketDataProvider {
  providerName: string;
  fetchSnapshot(): Promise<CricketProviderSnapshot>;
}
