import { randomUUID } from "crypto";
import { getCricketProvider } from "@/lib/providers/cricket";
import { getNeonSql } from "@/lib/server/neon";

export type SyncSummary = {
  provider: string;
  matchesUpserted: number;
  playersUpserted: number;
  teamsUpserted: number;
  rankingsUpserted: number;
  newsUpserted: number;
  syncedAt: string;
};

async function ensureCoreTables(sql: ReturnType<typeof getNeonSql>) {
  if (!sql) return;

  await sql`
    create table if not exists teams (
      id text primary key,
      name text not null,
      code text not null,
      league text not null,
      country text not null,
      ranking text not null,
      wins integer not null,
      losses integer not null,
      nrr text not null,
      captain text not null,
      players integer not null,
      source_provider text,
      source_entity_id text,
      source_updated_at timestamptz,
      ingested_at timestamptz not null default now(),
      raw jsonb not null default '{}'::jsonb
    )
  `;

  await sql`
    create table if not exists players (
      id text primary key,
      name text not null,
      team text not null,
      country text not null,
      format text not null,
      ranking text not null,
      status text not null,
      score integer not null,
      tier text not null,
      role text not null,
      source_provider text,
      source_entity_id text,
      source_updated_at timestamptz,
      ingested_at timestamptz not null default now(),
      raw jsonb not null default '{}'::jsonb
    )
  `;

  await sql`
    create table if not exists matches (
      id text primary key,
      status text not null,
      tournament text not null,
      format text not null,
      team1 text not null,
      team1_code text not null,
      score1 text not null,
      overs1 text not null,
      team2 text not null,
      team2_code text not null,
      score2 text not null,
      overs2 text not null,
      venue text not null,
      result text not null,
      ai_prediction text not null,
      start_time_utc timestamptz,
      source_provider text,
      source_entity_id text,
      source_updated_at timestamptz,
      ingested_at timestamptz not null default now(),
      raw jsonb not null default '{}'::jsonb
    )
  `;

  await sql`
    create table if not exists rankings (
      id text primary key,
      player text not null,
      country text not null,
      format text not null,
      rating integer not null,
      type text not null,
      source_provider text,
      source_entity_id text,
      source_updated_at timestamptz,
      ingested_at timestamptz not null default now(),
      raw jsonb not null default '{}'::jsonb
    )
  `;

  await sql`
    create table if not exists news (
      id text primary key,
      tag text not null,
      title text not null,
      summary text not null,
      time text not null,
      reads text not null,
      source_provider text,
      source_entity_id text,
      source_updated_at timestamptz,
      ingested_at timestamptz not null default now(),
      raw jsonb not null default '{}'::jsonb
    )
  `;
}

function safeIso(value?: string) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

export async function syncCricketData(): Promise<SyncSummary> {
  const sql = getNeonSql();
  if (!sql) {
    throw new Error("DATABASE_URL is required for sync. Set Neon connection first.");
  }

  const provider = getCricketProvider();
  const snapshot = await provider.fetchSnapshot();

  await ensureCoreTables(sql);

  let matchesUpserted = 0;
  let playersUpserted = 0;
  let teamsUpserted = 0;
  let rankingsUpserted = 0;
  let newsUpserted = 0;

  for (const m of snapshot.matches) {
    const id = `m-${m.externalId}`;
    await sql`
      insert into matches (
        id, status, tournament, format, team1, team1_code, score1, overs1,
        team2, team2_code, score2, overs2, venue, result, ai_prediction,
        start_time_utc, source_provider, source_entity_id, source_updated_at, ingested_at, raw
      )
      values (
        ${id}, ${m.status}, ${m.tournament}, ${m.format}, ${m.team1}, ${m.team1Code}, ${m.score1}, ${m.overs1},
        ${m.team2}, ${m.team2Code}, ${m.score2}, ${m.overs2}, ${m.venue}, ${m.result}, ${"Model pending"},
        ${m.startTimeUtc ? safeIso(m.startTimeUtc) : null}, ${provider.providerName}, ${m.externalId}, ${safeIso(m.sourceUpdatedAt)}, now(), ${JSON.stringify(m.raw ?? {})}::jsonb
      )
      on conflict (id) do update set
        status = excluded.status,
        tournament = excluded.tournament,
        format = excluded.format,
        team1 = excluded.team1,
        team1_code = excluded.team1_code,
        score1 = excluded.score1,
        overs1 = excluded.overs1,
        team2 = excluded.team2,
        team2_code = excluded.team2_code,
        score2 = excluded.score2,
        overs2 = excluded.overs2,
        venue = excluded.venue,
        result = excluded.result,
        start_time_utc = excluded.start_time_utc,
        source_provider = excluded.source_provider,
        source_entity_id = excluded.source_entity_id,
        source_updated_at = excluded.source_updated_at,
        ingested_at = now(),
        raw = excluded.raw
    `;
    matchesUpserted += 1;
  }

  for (const p of snapshot.players) {
    const id = `p-${p.externalId}`;
    await sql`
      insert into players (
        id, name, team, country, format, ranking, status, score, tier, role,
        source_provider, source_entity_id, source_updated_at, ingested_at, raw
      )
      values (
        ${id}, ${p.name}, ${p.team}, ${p.country}, ${p.format}, ${p.ranking}, ${p.status}, ${p.score}, ${p.tier}, ${p.role},
        ${provider.providerName}, ${p.externalId}, ${safeIso(p.sourceUpdatedAt)}, now(), ${JSON.stringify(p.raw ?? {})}::jsonb
      )
      on conflict (id) do update set
        name = excluded.name,
        team = excluded.team,
        country = excluded.country,
        format = excluded.format,
        ranking = excluded.ranking,
        status = excluded.status,
        score = excluded.score,
        tier = excluded.tier,
        role = excluded.role,
        source_provider = excluded.source_provider,
        source_entity_id = excluded.source_entity_id,
        source_updated_at = excluded.source_updated_at,
        ingested_at = now(),
        raw = excluded.raw
    `;
    playersUpserted += 1;
  }

  for (const t of snapshot.teams) {
    const id = `t-${t.externalId}`;
    await sql`
      insert into teams (
        id, name, code, league, country, ranking, wins, losses, nrr, captain, players,
        source_provider, source_entity_id, source_updated_at, ingested_at, raw
      )
      values (
        ${id}, ${t.name}, ${t.code}, ${t.league}, ${t.country}, ${t.ranking}, ${t.wins}, ${t.losses}, ${t.nrr}, ${t.captain}, ${t.players},
        ${provider.providerName}, ${t.externalId}, ${safeIso(t.sourceUpdatedAt)}, now(), ${JSON.stringify(t.raw ?? {})}::jsonb
      )
      on conflict (id) do update set
        name = excluded.name,
        code = excluded.code,
        league = excluded.league,
        country = excluded.country,
        ranking = excluded.ranking,
        wins = excluded.wins,
        losses = excluded.losses,
        nrr = excluded.nrr,
        captain = excluded.captain,
        players = excluded.players,
        source_provider = excluded.source_provider,
        source_entity_id = excluded.source_entity_id,
        source_updated_at = excluded.source_updated_at,
        ingested_at = now(),
        raw = excluded.raw
    `;
    teamsUpserted += 1;
  }

  for (const r of snapshot.rankings) {
    const id = `r-${r.externalId || randomUUID()}`;
    await sql`
      insert into rankings (
        id, player, country, format, rating, type,
        source_provider, source_entity_id, source_updated_at, ingested_at, raw
      )
      values (
        ${id}, ${r.player}, ${r.country}, ${r.format}, ${r.rating}, ${r.type},
        ${provider.providerName}, ${r.externalId}, ${safeIso(r.sourceUpdatedAt)}, now(), ${JSON.stringify(r.raw ?? {})}::jsonb
      )
      on conflict (id) do update set
        player = excluded.player,
        country = excluded.country,
        format = excluded.format,
        rating = excluded.rating,
        type = excluded.type,
        source_provider = excluded.source_provider,
        source_entity_id = excluded.source_entity_id,
        source_updated_at = excluded.source_updated_at,
        ingested_at = now(),
        raw = excluded.raw
    `;
    rankingsUpserted += 1;
  }

  for (const n of snapshot.news) {
    const id = `n-${n.externalId || randomUUID()}`;
    await sql`
      insert into news (
        id, tag, title, summary, time, reads,
        source_provider, source_entity_id, source_updated_at, ingested_at, raw
      )
      values (
        ${id}, ${n.tag}, ${n.title}, ${n.summary}, ${n.time}, ${n.reads},
        ${provider.providerName}, ${n.externalId}, ${safeIso(n.sourceUpdatedAt)}, now(), ${JSON.stringify(n.raw ?? {})}::jsonb
      )
      on conflict (id) do update set
        tag = excluded.tag,
        title = excluded.title,
        summary = excluded.summary,
        time = excluded.time,
        reads = excluded.reads,
        source_provider = excluded.source_provider,
        source_entity_id = excluded.source_entity_id,
        source_updated_at = excluded.source_updated_at,
        ingested_at = now(),
        raw = excluded.raw
    `;
    newsUpserted += 1;
  }

  return {
    provider: provider.providerName,
    matchesUpserted,
    playersUpserted,
    teamsUpserted,
    rankingsUpserted,
    newsUpserted,
    syncedAt: new Date().toISOString(),
  };
}
