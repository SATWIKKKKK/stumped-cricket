import type {
  CricketDataProvider,
  CricketProviderSnapshot,
  ProviderMatch,
  ProviderNews,
  ProviderPlayer,
  ProviderRanking,
  ProviderTeam,
} from "./types";

function safeString(value: unknown, fallback = "-") {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function toStatus(value: string): "LIVE" | "UPCOMING" | "COMPLETED" {
  const upper = value.toUpperCase();
  if (upper.includes("LIVE") || upper.includes("INPLAY") || upper.includes("RUNNING")) return "LIVE";
  if (upper.includes("COMPLETE") || upper.includes("FINISHED") || upper.includes("RESULT")) return "COMPLETED";
  return "UPCOMING";
}

export class SportMonksCricketProvider implements CricketDataProvider {
  providerName = "sportmonks";

  private readonly token: string;
  private readonly baseUrl: string;

  constructor() {
    const token = process.env.SPORTMONKS_API_TOKEN;
    if (!token) {
      throw new Error("SPORTMONKS_API_TOKEN is required for CRICKET_PROVIDER=sportmonks");
    }
    this.token = token;
    this.baseUrl = process.env.SPORTMONKS_BASE_URL || "https://api.sportmonks.com/v3/cricket";
  }

  private async request(path: string) {
    const separator = path.includes("?") ? "&" : "?";
    const url = `${this.baseUrl}${path}${separator}api_token=${encodeURIComponent(this.token)}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`SportMonks request failed (${response.status}): ${text.slice(0, 180)}`);
    }

    return response.json();
  }

  private mapMatches(payload: any): ProviderMatch[] {
    const rows = Array.isArray(payload?.data) ? payload.data : [];

    return rows.map((m: any) => {
      const runs1 = safeString(m?.localteam_dl_data?.score ?? m?.scores?.[0]?.score ?? "-");
      const wickets1 = safeString(m?.localteam_dl_data?.wickets_out ?? m?.scores?.[0]?.wickets ?? "-");
      const overs1 = safeString(m?.localteam_dl_data?.overs ?? m?.scores?.[0]?.overs ?? "-");
      const runs2 = safeString(m?.visitorteam_dl_data?.score ?? m?.scores?.[1]?.score ?? "-");
      const wickets2 = safeString(m?.visitorteam_dl_data?.wickets_out ?? m?.scores?.[1]?.wickets ?? "-");
      const overs2 = safeString(m?.visitorteam_dl_data?.overs ?? m?.scores?.[1]?.overs ?? "-");

      return {
        externalId: safeString(m?.id),
        status: toStatus(safeString(m?.status ?? m?.note ?? "UPCOMING")),
        tournament: safeString(m?.league?.name ?? m?.round ?? "Unknown League"),
        format: safeString(m?.type ?? "UNKNOWN"),
        team1: safeString(m?.localteam?.name ?? m?.localteam_id ?? "Team 1"),
        team1Code: safeString(m?.localteam?.code ?? m?.localteam?.name?.slice(0, 3)?.toUpperCase() ?? "T1"),
        score1: runs1 === "-" ? "-" : `${runs1}/${wickets1}`,
        overs1,
        team2: safeString(m?.visitorteam?.name ?? m?.visitorteam_id ?? "Team 2"),
        team2Code: safeString(m?.visitorteam?.code ?? m?.visitorteam?.name?.slice(0, 3)?.toUpperCase() ?? "T2"),
        score2: runs2 === "-" ? "-" : `${runs2}/${wickets2}`,
        overs2,
        venue: safeString(m?.venue?.name ?? "Unknown Venue"),
        result: safeString(m?.note ?? "Match update pending"),
        startTimeUtc: safeString(m?.starting_at ?? ""),
        sourceUpdatedAt: new Date().toISOString(),
        raw: m,
      };
    });
  }

  private mapTeams(payload: any): ProviderTeam[] {
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return rows.map((t: any) => ({
      externalId: safeString(t?.id),
      name: safeString(t?.name ?? "UNKNOWN TEAM").toUpperCase(),
      code: safeString(t?.code ?? t?.name?.slice(0, 3)?.toUpperCase() ?? "UNK"),
      league: safeString(t?.country?.name ?? "INTERNATIONAL"),
      country: safeString(t?.country?.name ?? "UNKNOWN").toUpperCase(),
      ranking: "-",
      wins: Number(t?.results?.wins ?? 0),
      losses: Number(t?.results?.losses ?? 0),
      nrr: "0.000",
      captain: safeString(t?.captain?.fullname ?? "UNKNOWN"),
      players: Number(t?.squad?.length ?? 0),
      sourceUpdatedAt: new Date().toISOString(),
      raw: t,
    }));
  }

  private mapPlayers(payload: any): ProviderPlayer[] {
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return rows.map((p: any) => ({
      externalId: safeString(p?.id),
      name: safeString(p?.fullname ?? p?.name ?? "UNKNOWN PLAYER").toUpperCase(),
      team: safeString(p?.country?.name ?? "INTL").toUpperCase(),
      country: safeString(p?.country?.name ?? "UNK").toUpperCase(),
      format: "ALL",
      ranking: "-",
      status: "ACTIVE",
      score: 70,
      tier: "A",
      role: safeString(p?.position?.name ?? "ALL").toUpperCase(),
      sourceUpdatedAt: new Date().toISOString(),
      raw: p,
    }));
  }

  private mapRankings(payload: any): ProviderRanking[] {
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return rows.map((r: any, index: number) => ({
      externalId: safeString(r?.id ?? `ranking-${index + 1}`),
      player: safeString(r?.player?.fullname ?? r?.team?.name ?? "UNKNOWN").toUpperCase(),
      country: safeString(r?.player?.country?.name ?? r?.team?.country?.name ?? "UNK").toUpperCase(),
      format: safeString(r?.type ?? "ALL").toUpperCase(),
      rating: Number(r?.rating ?? 0),
      type: safeString(r?.ranking_type ?? "GENERAL").toUpperCase(),
      sourceUpdatedAt: new Date().toISOString(),
      raw: r,
    }));
  }

  private mapNews(payload: any): ProviderNews[] {
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return rows.map((n: any) => ({
      externalId: safeString(n?.id),
      tag: safeString(n?.category ?? "UPDATE").toUpperCase(),
      title: safeString(n?.title ?? "Cricket Update"),
      summary: safeString(n?.excerpt ?? n?.summary ?? "No summary available"),
      time: safeString(n?.published_at ?? "recently"),
      reads: safeString(n?.views ?? "-"),
      sourceUpdatedAt: new Date().toISOString(),
      raw: n,
    }));
  }

  async fetchSnapshot(): Promise<CricketProviderSnapshot> {
    const [fixturesPayload, teamsPayload, playersPayload, rankingsPayload, newsPayload] = await Promise.all([
      this.request("/fixtures?include=league,localteam,visitorteam,venue,scores&per_page=50"),
      this.request("/teams?include=country&per_page=100"),
      this.request("/players?include=country,position&per_page=100"),
      this.request("/team-rankings?per_page=100").catch(() => ({ data: [] })),
      this.request("/news?per_page=30").catch(() => ({ data: [] })),
    ]);

    return {
      matches: this.mapMatches(fixturesPayload),
      teams: this.mapTeams(teamsPayload),
      players: this.mapPlayers(playersPayload),
      rankings: this.mapRankings(rankingsPayload),
      news: this.mapNews(newsPayload),
    };
  }
}
