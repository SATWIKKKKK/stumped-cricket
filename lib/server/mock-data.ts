import type { MatchItem, NewsItem, Player, PlayerTrackingEvent, RankingItem, TeamItem } from "./types";

export const mockPlayers: Player[] = [
  { id: "vk-18", name: "VIRAT KOHLI", team: "RCB", country: "IND", format: "ALL", ranking: "#01 ODI", status: "LEGEND", score: 96, tier: "A+", role: "BAT" },
  { id: "jb-93", name: "JASPRIT BUMRAH", team: "MI", country: "IND", format: "ALL", ranking: "#01 BOWL", status: "ELITE", score: 98, tier: "A+", role: "BOWL" },
  { id: "ra-77", name: "RASHID KHAN", team: "GT", country: "AFG", format: "T20", ranking: "#01 SPIN", status: "ELITE", score: 96, tier: "A+", role: "SPIN" },
];

export const mockMatches: MatchItem[] = [
  {
    id: "ipl-2024-01",
    status: "LIVE",
    tournament: "IPL 2024",
    format: "T20",
    team1: "Mumbai Indians",
    team1Code: "MI",
    score1: "187/4",
    overs1: "20.0",
    team2: "Chennai Super Kings",
    team2Code: "CSK",
    score2: "142/6",
    overs2: "17.3",
    venue: "Wankhede Stadium",
    result: "MI need 46 from 15 balls",
    aiPrediction: "MI win 78%",
  },
  {
    id: "odi-2024-02",
    status: "UPCOMING",
    tournament: "International Series",
    format: "ODI",
    team1: "India",
    team1Code: "IND",
    score1: "-",
    overs1: "-",
    team2: "England",
    team2Code: "ENG",
    score2: "-",
    overs2: "-",
    venue: "Lords",
    result: "Toss pending",
    aiPrediction: "IND favor 61%",
  },
];

export const mockTeams: TeamItem[] = [
  { id: "mi", name: "MUMBAI INDIANS", code: "MI", league: "IPL", country: "INDIA", ranking: "#01", wins: 14, losses: 6, nrr: "+0.821", captain: "ROHIT SHARMA", players: 22 },
  { id: "csk", name: "CHENNAI SUPER KINGS", code: "CSK", league: "IPL", country: "INDIA", ranking: "#02", wins: 12, losses: 8, nrr: "+0.412", captain: "MS DHONI", players: 21 },
];

export const mockNews: NewsItem[] = [
  {
    id: "news-1",
    tag: "LIVE",
    title: "Powerplay pressure reshapes chase",
    summary: "Early wickets and aggressive lines changed match momentum in first six overs.",
    time: "2 min ago",
    reads: "4.2k",
  },
  {
    id: "news-2",
    tag: "ANALYSIS",
    title: "Death over plan raises expected win",
    summary: "Bowling map and field spread lifted expected win probability by 11 points.",
    time: "18 min ago",
    reads: "2.1k",
  },
];

export const mockRankings: RankingItem[] = [
  { id: "r1", player: "VIRAT KOHLI", country: "IND", format: "ODI", rating: 914, type: "BAT" },
  { id: "r2", player: "JASPRIT BUMRAH", country: "IND", format: "TEST", rating: 905, type: "BOWL" },
  { id: "r3", player: "RASHID KHAN", country: "AFG", format: "T20", rating: 889, type: "BOWL" },
];

export const trackingStore: PlayerTrackingEvent[] = [];
