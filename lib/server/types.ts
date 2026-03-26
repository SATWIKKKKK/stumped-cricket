export type Player = {
  id: string;
  name: string;
  team: string;
  country: string;
  format: string;
  ranking: string;
  status: string;
  score: number;
  tier: string;
  role: string;
};

export type MatchItem = {
  id: string;
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
  aiPrediction: string;
};

export type TeamItem = {
  id: string;
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
};

export type NewsItem = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  time: string;
  reads: string;
};

export type RankingItem = {
  id: string;
  player: string;
  country: string;
  format: string;
  rating: number;
  type: string;
};

export type PlayerTrackingEvent = {
  id: string;
  playerId: string;
  eventType: string;
  source: string;
  createdAt: string;
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  playerId: string;
  role: "user";
  passwordHash: string | null;
  provider: "credentials" | "google";
  createdAt: string;
};

export type SafeUserAccount = Omit<UserAccount, "passwordHash">;
