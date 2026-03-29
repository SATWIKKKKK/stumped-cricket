import { NextRequest, NextResponse } from "next/server";
import { ALL_CRICKET_TEAMS } from "@/lib/data/cricket-teams";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashPair(a: string, b: string): number {
  const str = [a, b].sort().join("|");
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const team1Code = (searchParams.get("team1") ?? "").toUpperCase();
  const team2Code = (searchParams.get("team2") ?? "").toUpperCase();

  if (!team1Code || !team2Code) {
    return NextResponse.json({ error: "team1 and team2 query params required" }, { status: 400 });
  }

  const t1 = ALL_CRICKET_TEAMS.find((t) => t.code === team1Code);
  const t2 = ALL_CRICKET_TEAMS.find((t) => t.code === team2Code);

  if (!t1 || !t2) {
    return NextResponse.json({ error: "One or both team codes not found" }, { status: 404 });
  }

  const seed = hashPair(team1Code, team2Code);
  const rng = seededRandom(seed);

  // Generate deterministic but realistic match data
  const score1Total = Math.round(120 + rng() * 80);
  const wickets1 = Math.min(10, Math.round(2 + rng() * 8));
  const overs1Full = rng() > 0.3 ? 20 : Math.round(14 + rng() * 6);
  const balls1 = Math.round(rng() * 5);

  const score2Total = Math.round(100 + rng() * 90);
  const wickets2 = Math.min(10, Math.round(1 + rng() * 9));
  const overs2Full = wickets2 === 10 ? Math.round(15 + rng() * 5) : Math.round(16 + rng() * 4);
  const balls2 = Math.round(rng() * 5);

  const score1Str = `${score1Total}/${wickets1}`;
  const score2Str = `${score2Total}/${wickets2}`;
  const overs1Str = `${overs1Full}.${balls1}`;
  const overs2Str = `${overs2Full}.${balls2}`;

  const t1WinProb = Math.round(40 + rng() * 25);
  const t2WinProb = 100 - t1WinProb;
  const favTeam = t1WinProb > t2WinProb ? t1 : t2;

  const venues = [
    "Wankhede Stadium, Mumbai",
    "Eden Gardens, Kolkata",
    "M. Chinnaswamy Stadium, Bengaluru",
    "MA Chidambaram Stadium, Chennai",
    "Narendra Modi Stadium, Ahmedabad",
    "Melbourne Cricket Ground",
    "Lord's Cricket Ground, London",
    "The Gabba, Brisbane",
    "Gaddafi Stadium, Lahore",
    "Dubai International Stadium",
    "Newlands, Cape Town",
    "Hagley Oval, Christchurch",
  ];
  const venue = venues[Math.round(rng() * (venues.length - 1))];

  const sameLeague = t1.league === t2.league;
  const tournament = sameLeague && t1.league !== "ICC"
    ? `${t1.league} 2026`
    : t1.league === "ICC" && t2.league === "ICC"
    ? "ICC International Series"
    : "Bilateral Series 2026";

  const statuses: Array<"LIVE" | "UPCOMING" | "COMPLETED"> = ["LIVE", "UPCOMING", "COMPLETED"];
  const status = statuses[Math.round(rng() * 2)];

  const match = {
    id: `matchup-${team1Code}-${team2Code}`,
    status,
    tournament,
    format: "T20" as const,
    team1: t1.name,
    team1Code: t1.code,
    score1: status === "UPCOMING" ? "-" : score1Str,
    overs1: status === "UPCOMING" ? "-" : overs1Str,
    team2: t2.name,
    team2Code: t2.code,
    score2: status === "UPCOMING" ? "-" : score2Str,
    overs2: status === "UPCOMING" ? "-" : overs2Str,
    venue,
    result: status === "COMPLETED"
      ? `${favTeam.name} won by ${Math.round(10 + rng() * 40)} runs`
      : status === "LIVE"
      ? `${favTeam.name} need ${Math.round(20 + rng() * 60)} from ${Math.round(12 + rng() * 24)} balls`
      : "Toss pending",
    aiPrediction: `${favTeam.code} win ${Math.max(t1WinProb, t2WinProb)}%`,
  };

  // Generate player data for both teams
  const roles = ["BAT", "BOWL", "AR", "WK", "SPIN"];
  const tiers = ["A+", "A", "A", "B+", "B+", "B"];
  const generatePlayers = (team: typeof t1, offset: number) => {
    const playerNames = [
      "Captain", "Opener 1", "Opener 2", "No.3", "Middle Order", "Finisher",
      "All-Rounder", "Spinner", "Pacer 1", "Pacer 2", "Pacer 3",
    ];
    return playerNames.map((label, i) => {
      const r = seededRandom(seed + offset + i);
      return {
        id: `${team.code.toLowerCase()}-p${i + 1}`,
        name: `${team.code} ${label}`.toUpperCase(),
        team: team.code,
        country: team.country,
        format: "T20",
        ranking: `#${Math.round(1 + r() * 50)}`,
        status: r() > 0.7 ? "ELITE" : r() > 0.4 ? "IMPACT" : "RISING",
        score: Math.round(55 + r() * 45),
        tier: tiers[Math.min(i, tiers.length - 1)],
        role: roles[i % roles.length],
      };
    });
  };

  const players = [...generatePlayers(t1, 100), ...generatePlayers(t2, 200)];

  // Teams with stats
  const teamStats = [t1, t2].map((t, idx) => {
    const r = seededRandom(seed + 300 + idx);
    return {
      id: t.code.toLowerCase(),
      name: t.name.toUpperCase(),
      code: t.code,
      league: t.league,
      country: t.country,
      ranking: `#${Math.round(1 + r() * 12)}`,
      wins: Math.round(5 + r() * 15),
      losses: Math.round(2 + r() * 10),
      nrr: `${r() > 0.5 ? "+" : "-"}${(r() * 1.5).toFixed(3)}`,
      captain: `${t.code} CAPTAIN`,
      players: 22,
    };
  });

  // Rankings
  const rankings = players.slice(0, 6).map((p, i) => ({
    id: `rank-${p.id}`,
    player: p.name,
    country: p.country,
    format: "T20",
    rating: Math.round(800 + (6 - i) * 20 + seededRandom(seed + 400 + i)() * 30),
    type: p.role,
  }));

  // News
  const newsItems = [
    { tag: "LIVE", title: `${t1.code} vs ${t2.code}: Key battle lines drawn`, summary: `Tactical breakdown of the ${t1.name} vs ${t2.name} matchup reveals fascinating patterns.`, time: "2 min ago", reads: `${Math.round(1 + rng() * 8)}k` },
    { tag: "ANALYSIS", title: `AI Model predicts ${favTeam.code} advantage`, summary: `Our predictive engine gives ${favTeam.name} a ${Math.max(t1WinProb, t2WinProb)}% win probability based on form and conditions.`, time: "12 min ago", reads: `${Math.round(1 + rng() * 5)}k` },
    { tag: "INTEL", title: `Head-to-head: ${t1.code} leads historical record`, summary: `In recent encounters, ${t1.name} have shown superior adaptability in pressure situations.`, time: "1h ago", reads: `${Math.round(1 + rng() * 3)}k` },
  ].map((n, i) => ({ ...n, id: `news-matchup-${i}` }));

  return NextResponse.json({
    data: {
      players,
      matches: [match],
      teams: teamStats,
      news: newsItems,
      rankings,
    },
  });
}
