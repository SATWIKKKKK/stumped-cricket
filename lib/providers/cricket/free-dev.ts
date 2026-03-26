import {
  mockMatches,
  mockNews,
  mockPlayers,
  mockRankings,
  mockTeams,
} from "@/lib/server/mock-data";
import type {
  CricketDataProvider,
  CricketProviderSnapshot,
  ProviderMatch,
  ProviderNews,
  ProviderPlayer,
  ProviderRanking,
  ProviderTeam,
} from "./types";

function mapMatch(): ProviderMatch[] {
  return mockMatches.map((m) => ({
    externalId: m.id,
    status: m.status,
    tournament: m.tournament,
    format: m.format,
    team1: m.team1,
    team1Code: m.team1Code,
    score1: m.score1,
    overs1: m.overs1,
    team2: m.team2,
    team2Code: m.team2Code,
    score2: m.score2,
    overs2: m.overs2,
    venue: m.venue,
    result: m.result,
    startTimeUtc: undefined,
    sourceUpdatedAt: new Date().toISOString(),
    raw: m,
  }));
}

function mapPlayers(): ProviderPlayer[] {
  return mockPlayers.map((p) => ({
    externalId: p.id,
    name: p.name,
    team: p.team,
    country: p.country,
    format: p.format,
    ranking: p.ranking,
    status: p.status,
    score: p.score,
    tier: p.tier,
    role: p.role,
    sourceUpdatedAt: new Date().toISOString(),
    raw: p,
  }));
}

function mapTeams(): ProviderTeam[] {
  return mockTeams.map((t) => ({
    externalId: t.id,
    name: t.name,
    code: t.code,
    league: t.league,
    country: t.country,
    ranking: t.ranking,
    wins: t.wins,
    losses: t.losses,
    nrr: t.nrr,
    captain: t.captain,
    players: t.players,
    sourceUpdatedAt: new Date().toISOString(),
    raw: t,
  }));
}

function mapRankings(): ProviderRanking[] {
  return mockRankings.map((r) => ({
    externalId: r.id,
    player: r.player,
    country: r.country,
    format: r.format,
    rating: r.rating,
    type: r.type,
    sourceUpdatedAt: new Date().toISOString(),
    raw: r,
  }));
}

function mapNews(): ProviderNews[] {
  return mockNews.map((n) => ({
    externalId: n.id,
    tag: n.tag,
    title: n.title,
    summary: n.summary,
    time: n.time,
    reads: n.reads,
    sourceUpdatedAt: new Date().toISOString(),
    raw: n,
  }));
}

export class FreeDevCricketProvider implements CricketDataProvider {
  providerName = "free-dev";

  async fetchSnapshot(): Promise<CricketProviderSnapshot> {
    return {
      matches: mapMatch(),
      players: mapPlayers(),
      teams: mapTeams(),
      rankings: mapRankings(),
      news: mapNews(),
    };
  }
}
