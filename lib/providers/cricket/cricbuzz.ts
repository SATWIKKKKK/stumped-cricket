import type {
  CricketDataProvider,
  CricketProviderSnapshot,
  ProviderMatch,
  ProviderNews,
  ProviderPlayer,
  ProviderRanking,
  ProviderTeam,
} from "./types";

const BASE = "https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co";

const ENDPOINTS: Record<string, string> = {
  home: "95df5edd-bd8b-4881-a12b-1a40e519b693",
  "matches/live": "e0cb5c72-38e1-435e-8bf0-6b38fbe923b7",
  "matches/upcoming": "1943a818-98e9-48ea-8d1c-1554e116ef44",
  "matches/recent": "8ff18bd6-7f60-45a1-bf9b-4f82b3e4c6ac",
  news: "b02fb028-fcca-4590-bf04-d0cd0c331af4",
  match: "ac951751-d311-4d23-8f18-353e75432353",
  "match/scorecard": "5f260335-c228-4005-9eec-318200ca48d6",
  "match/commentary": "8cb69a0f-bcaa-45b5-a016-229a2e7594f6",
  "match/squads": "be37c2f5-3a12-44bd-8d8b-ba779eb89279",
  "match/overs": "5db6b2f0-86b9-44b5-bfc4-8c2888acd4de",
  "match/highlights": "08eecac5-70b7-4001-b435-abe292af180a",
  series: "661c6b89-b558-41fa-9553-d0aca64fcb6f",
  "series/news": "f0e25fa6-e8a8-47f7-affb-db42c580e582",
  "series/squads": "038d223b-aca5-4096-8eb1-184dd0c09513",
  "series/squads/match": "c4b3ccd2-0bb1-4d94-98c9-b31f389480be",
  "series/stats": "4655dba4-3378-4360-a6fb-5d173092cb18",
  "series/stats/type": "ab18103f-c4fc-4a7d-92ef-442a53c4683b",
  "series/venues": "9ae2dc0d-7a19-4872-bd0b-ff6651766589",
  "series/pointtable": "6830bedf-6c0d-472d-9f73-18711230e7a2",
};

function headers(endpointKey: string): HeadersInit {
  const apiKey = process.env.CRICBUZZ_API_KEY ?? "";
  return {
    "x-apihub-key": apiKey,
    "x-apihub-host": "Cricbuzz-Official-Cricket-API.allthingsdev.co",
    "x-apihub-endpoint": ENDPOINTS[endpointKey] ?? "",
  };
}

// --------------- Raw Cricbuzz types ---------------

interface CbTeam {
  teamId: number;
  teamName: string;
  teamSName: string;
  imageId?: number;
}

interface CbInnings {
  inningsId: number;
  runs: number;
  wickets: number;
  overs: number;
}

interface CbMatchInfo {
  matchId: number;
  seriesId: number;
  seriesName: string;
  matchDesc: string;
  matchFormat: string;
  startDate: string;
  endDate: string;
  state: string;
  status: string;
  team1: CbTeam;
  team2: CbTeam;
  venueInfo?: { ground: string; city: string };
  stateTitle?: string;
  currBatTeamId?: number;
}

interface CbMatchScore {
  team1Score?: { inngs1?: CbInnings; inngs2?: CbInnings };
  team2Score?: { inngs1?: CbInnings; inngs2?: CbInnings };
}

interface CbMatch {
  matchInfo: CbMatchInfo;
  matchScore?: CbMatchScore;
}

interface CbSeriesWrapper {
  seriesAdWrapper?: {
    seriesId: number;
    seriesName: string;
    matches?: CbMatch[];
  };
}

interface CbTypeMatch {
  matchType: string;
  seriesMatches: CbSeriesWrapper[];
}

interface CbStory {
  story?: {
    id: number;
    hline: string;
    intro: string;
    pubTime: string;
    source: string;
    context?: string;
  };
}

// --------------- Helpers ---------------

function formatScore(innings?: CbInnings): string {
  if (!innings) return "-";
  return `${innings.runs}/${innings.wickets}`;
}

function formatOvers(innings?: CbInnings): string {
  if (!innings) return "-";
  return `${innings.overs}`;
}

function bestInnings(
  score?: { inngs1?: CbInnings; inngs2?: CbInnings }
): CbInnings | undefined {
  if (!score) return undefined;
  return score.inngs2 ?? score.inngs1;
}

function mapStatus(state: string): "LIVE" | "UPCOMING" | "COMPLETED" {
  const s = state.toLowerCase();
  if (s === "complete" || s === "complete" || s.includes("won")) return "COMPLETED";
  if (s === "preview" || s === "upcoming" || s === "dormant") return "UPCOMING";
  return "LIVE";
}

function mapFormat(fmt: string): string {
  const f = fmt.toUpperCase();
  if (f === "TEST") return "TEST";
  if (f === "ODI") return "ODI";
  return "T20";
}

function timeAgo(epochMs: string): string {
  const diff = Date.now() - Number(epochMs);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// --------------- Public fetch helpers ---------------

export async function cbFetch<T = unknown>(
  path: string,
  endpointKey: string
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(endpointKey),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Cricbuzz ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchLiveMatches(): Promise<CbMatch[]> {
  const data = await cbFetch<{ typeMatches?: CbTypeMatch[] }>(
    "/matches/live",
    "matches/live"
  );
  return extractMatches(data.typeMatches ?? []);
}

export async function fetchRecentMatches(): Promise<CbMatch[]> {
  const data = await cbFetch<{ typeMatches?: CbTypeMatch[] }>(
    "/matches/recent",
    "matches/recent"
  );
  return extractMatches(data.typeMatches ?? []);
}

export async function fetchUpcomingMatches(): Promise<CbMatch[]> {
  const data = await cbFetch<{ typeMatches?: CbTypeMatch[] }>(
    "/matches/upcoming",
    "matches/upcoming"
  );
  return extractMatches(data.typeMatches ?? []);
}

export async function fetchNews(): Promise<CbStory[]> {
  const data = await cbFetch<{ storyList?: CbStory[] }>("/news", "news");
  return (data.storyList ?? []).filter((s) => s.story);
}

export async function fetchMatchScorecard(matchId: number) {
  return cbFetch(`/match/${matchId}/scorecard`, "match/scorecard");
}

export async function fetchMatchCommentary(matchId: number) {
  return cbFetch(`/match/${matchId}/commentary`, "match/commentary");
}

export async function fetchMatchSquads(matchId: number) {
  return cbFetch(`/match/${matchId}/squads`, "match/squads");
}

export async function fetchSeriesStats(seriesId: number, statType?: string) {
  const q = statType ? `?statType=${statType}` : "";
  return cbFetch(`/series/${seriesId}/stats${q}`, statType ? "series/stats/type" : "series/stats");
}

export async function fetchSeriesPointTable(seriesId: number) {
  return cbFetch(`/series/${seriesId}/pointtable`, "series/pointtable");
}

function extractMatches(typeMatches: CbTypeMatch[]): CbMatch[] {
  const out: CbMatch[] = [];
  for (const tm of typeMatches) {
    for (const sm of tm.seriesMatches) {
      if (sm.seriesAdWrapper?.matches) {
        out.push(...sm.seriesAdWrapper.matches);
      }
    }
  }
  return out;
}

// --------------- Mappers to provider types ---------------

function cbMatchToProvider(cb: CbMatch): ProviderMatch {
  const info = cb.matchInfo;
  const t1Best = bestInnings(cb.matchScore?.team1Score);
  const t2Best = bestInnings(cb.matchScore?.team2Score);

  return {
    externalId: String(info.matchId),
    status: mapStatus(info.state),
    tournament: info.seriesName,
    format: mapFormat(info.matchFormat),
    team1: info.team1.teamName,
    team1Code: info.team1.teamSName,
    score1: formatScore(t1Best),
    overs1: formatOvers(t1Best),
    team2: info.team2.teamName,
    team2Code: info.team2.teamSName,
    score2: formatScore(t2Best),
    overs2: formatOvers(t2Best),
    venue: info.venueInfo
      ? `${info.venueInfo.ground}, ${info.venueInfo.city}`
      : "TBC",
    result: info.status,
    startTimeUtc: info.startDate,
    raw: cb,
  };
}

function cbStoryToProvider(s: CbStory): ProviderNews | null {
  if (!s.story) return null;
  return {
    externalId: String(s.story.id),
    tag: s.story.context ?? "NEWS",
    title: s.story.hline,
    summary: s.story.intro,
    time: timeAgo(s.story.pubTime),
    reads: "-",
    raw: s.story,
  };
}

// --------------- Provider class ---------------

export class CricbuzzProvider implements CricketDataProvider {
  providerName = "cricbuzz";

  async fetchSnapshot(): Promise<CricketProviderSnapshot> {
    const [live, recent, upcoming, newsRaw] = await Promise.all([
      fetchLiveMatches().catch(() => []),
      fetchRecentMatches().catch(() => []),
      fetchUpcomingMatches().catch(() => []),
      fetchNews().catch(() => []),
    ]);

    const allMatches = [...live, ...recent, ...upcoming];
    // Deduplicate by matchId
    const seen = new Set<number>();
    const uniqueMatches: CbMatch[] = [];
    for (const m of allMatches) {
      if (!seen.has(m.matchInfo.matchId)) {
        seen.add(m.matchInfo.matchId);
        uniqueMatches.push(m);
      }
    }

    const matches = uniqueMatches.map(cbMatchToProvider);
    const news = newsRaw
      .map(cbStoryToProvider)
      .filter((n): n is ProviderNews => n !== null);

    // Derive teams from matches
    const teamMap = new Map<string, ProviderTeam>();
    for (const m of matches) {
      if (!teamMap.has(m.team1Code)) {
        teamMap.set(m.team1Code, {
          externalId: m.team1Code.toLowerCase(),
          name: m.team1,
          code: m.team1Code,
          league: m.tournament,
          country: m.team1,
          ranking: "-",
          wins: 0,
          losses: 0,
          nrr: "+0.000",
          captain: "-",
          players: 11,
        });
      }
      if (!teamMap.has(m.team2Code)) {
        teamMap.set(m.team2Code, {
          externalId: m.team2Code.toLowerCase(),
          name: m.team2,
          code: m.team2Code,
          league: m.tournament,
          country: m.team2,
          ranking: "-",
          wins: 0,
          losses: 0,
          nrr: "+0.000",
          captain: "-",
          players: 11,
        });
      }
      // Track wins/losses from completed matches
      if (m.status === "COMPLETED" && m.result) {
        const t1 = teamMap.get(m.team1Code)!;
        const t2 = teamMap.get(m.team2Code)!;
        if (m.result.toLowerCase().includes(m.team1.toLowerCase().split(" ")[0])) {
          t1.wins++;
          t2.losses++;
        } else {
          t2.wins++;
          t1.losses++;
        }
      }
    }
    const teams = Array.from(teamMap.values());

    // Players & rankings are not available from these endpoints
    // Return empty — dashboard will handle gracefully
    const players: ProviderPlayer[] = [];
    const rankings: ProviderRanking[] = [];

    return { matches, players, teams, rankings, news };
  }
}
