import { randomUUID } from "crypto";
import { getNeonSql } from "./neon";
import { syncCricketData } from "./ingestion/sync-cricket";
import {
  mockMatches,
  mockNews,
  mockPlayers,
  mockRankings,
  mockTeams,
  trackingStore,
} from "./mock-data";
import type {
  MatchItem,
  Player,
  PlayerTrackingEvent,
  RankingItem,
  SafeUserAccount,
  TeamItem,
  UserAccount,
} from "./types";

const globalUserStore = globalThis as unknown as {
  __stumpedUserStore?: UserAccount[];
};

const userStore: UserAccount[] = globalUserStore.__stumpedUserStore ?? [];
if (!globalUserStore.__stumpedUserStore) {
  globalUserStore.__stumpedUserStore = userStore;
}

const globalSyncStore = globalThis as unknown as {
  __stumpedSyncPromise?: Promise<void> | null;
  __stumpedLastSyncAt?: number;
};

if (globalSyncStore.__stumpedSyncPromise === undefined) {
  globalSyncStore.__stumpedSyncPromise = null;
}

if (globalSyncStore.__stumpedLastSyncAt === undefined) {
  globalSyncStore.__stumpedLastSyncAt = 0;
}

function hasDb() {
  return Boolean(getNeonSql());
}

function isAutoSyncEnabled() {
  return process.env.CRICKET_AUTO_SYNC !== "false";
}

async function ensureAutoSynced() {
  if (!hasDb() || !isAutoSyncEnabled()) {
    return;
  }

  const now = Date.now();
  const minGapMs = 15_000;
  if (now - (globalSyncStore.__stumpedLastSyncAt ?? 0) < minGapMs) {
    return;
  }

  if (!globalSyncStore.__stumpedSyncPromise) {
    globalSyncStore.__stumpedSyncPromise = (async () => {
      try {
        await Promise.race([
          syncCricketData(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("sync timeout")), 12000)),
        ]);
      } catch {
        // Keep API resilient. On sync failure callers still return existing DB rows or mock fallback.
      } finally {
        globalSyncStore.__stumpedLastSyncAt = Date.now();
        globalSyncStore.__stumpedSyncPromise = null;
      }
    })();
  }

  await globalSyncStore.__stumpedSyncPromise;
}

function sanitizeUser(user: UserAccount): SafeUserAccount {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePlayerId(value: string) {
  return value.trim();
}

export async function findUserByEmail(email: string): Promise<UserAccount | null> {
  const normalizedEmail = normalizeEmail(email);
  const fallbackUser = userStore.find((u) => normalizeEmail(u.email) === normalizedEmail) ?? null;

  if (!hasDb()) {
    return fallbackUser;
  }

  try {
    const sql = getNeonSql();
    if (!sql) {
      return userStore.find((u) => normalizeEmail(u.email) === normalizedEmail) ?? null;
    }

    const rows = await sql`
      select id, name, email, player_id as "playerId", role, password_hash as "passwordHash", provider, created_at as "createdAt"
      from users
      where lower(email) = ${normalizedEmail}
      limit 1
    `;

    return (rows[0] as UserAccount | undefined) ?? fallbackUser;
  } catch {
    return fallbackUser;
  }
}

export async function findUserByPlayerId(playerId: string): Promise<UserAccount | null> {
  const normalizedPlayerId = normalizePlayerId(playerId);
  const fallbackUser = userStore.find((u) => normalizePlayerId(u.playerId) === normalizedPlayerId) ?? null;

  if (!hasDb()) {
    return fallbackUser;
  }

  try {
    const sql = getNeonSql();
    if (!sql) {
      return userStore.find((u) => normalizePlayerId(u.playerId) === normalizedPlayerId) ?? null;
    }

    const rows = await sql`
      select id, name, email, player_id as "playerId", role, password_hash as "passwordHash", provider, created_at as "createdAt"
      from users
      where player_id = ${normalizedPlayerId}
      limit 1
    `;

    return (rows[0] as UserAccount | undefined) ?? fallbackUser;
  } catch {
    return fallbackUser;
  }
}

export async function getSafeUserById(id: string): Promise<SafeUserAccount | null> {
  const fallbackUser = userStore.find((u) => u.id === id);

  if (!hasDb()) {
    return fallbackUser ? sanitizeUser(fallbackUser) : null;
  }

  try {
    const sql = getNeonSql();
    if (!sql) {
      const user = userStore.find((u) => u.id === id);
      return user ? sanitizeUser(user) : null;
    }

    const rows = await sql`
      select id, name, email, player_id as "playerId", role, password_hash as "passwordHash", provider, created_at as "createdAt"
      from users
      where id = ${id}
      limit 1
    `;

    const user = (rows[0] as UserAccount | undefined) ?? fallbackUser;
    return user ? sanitizeUser(user) : null;
  } catch {
    return fallbackUser ? sanitizeUser(fallbackUser) : null;
  }
}

export async function createCredentialsUser(input: {
  name: string;
  email: string;
  playerId: string;
  passwordHash: string;
}): Promise<SafeUserAccount> {
  const payload: UserAccount = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    playerId: normalizePlayerId(input.playerId),
    role: "user",
    passwordHash: input.passwordHash,
    provider: "credentials",
    createdAt: new Date().toISOString(),
  };

  if (!hasDb()) {
    userStore.unshift(payload);
    return sanitizeUser(payload);
  }

  try {
    const sql = getNeonSql();
    if (!sql) {
      userStore.unshift(payload);
      return sanitizeUser(payload);
    }

    await sql`
      insert into users (id, name, email, player_id, role, password_hash, provider, created_at)
      values (${payload.id}, ${payload.name}, ${payload.email}, ${payload.playerId}, ${payload.role}, ${payload.passwordHash}, ${payload.provider}, ${payload.createdAt})
    `;

    return sanitizeUser(payload);
  } catch {
    userStore.unshift(payload);
    return sanitizeUser(payload);
  }
}

export async function createGoogleUserIfMissing(input: {
  email: string;
  name: string;
}): Promise<SafeUserAccount> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    return sanitizeUser(existing);
  }

  const basePlayerId = input.email.split("@")[0].replace(/[^a-zA-Z0-9-]/g, "-") || "user";
  let playerId = basePlayerId;
  let i = 1;
  while (await findUserByPlayerId(playerId)) {
    i += 1;
    playerId = `${basePlayerId}-${i}`;
  }

  const payload: UserAccount = {
    id: randomUUID(),
    name: input.name.trim() || "Cricket User",
    email: normalizeEmail(input.email),
    playerId,
    role: "user",
    passwordHash: null,
    provider: "google",
    createdAt: new Date().toISOString(),
  };

  if (!hasDb()) {
    userStore.unshift(payload);
    return sanitizeUser(payload);
  }

  try {
    const sql = getNeonSql();
    if (!sql) {
      userStore.unshift(payload);
      return sanitizeUser(payload);
    }

    await sql`
      insert into users (id, name, email, player_id, role, password_hash, provider, created_at)
      values (${payload.id}, ${payload.name}, ${payload.email}, ${payload.playerId}, ${payload.role}, ${payload.passwordHash}, ${payload.provider}, ${payload.createdAt})
    `;

    return sanitizeUser(payload);
  } catch {
    userStore.unshift(payload);
    return sanitizeUser(payload);
  }
}

export async function listPlayers(): Promise<Player[]> {
  if (!hasDb()) return mockPlayers;
  try {
    const sql = getNeonSql();
    if (!sql) return mockPlayers;
    let rows = await sql`select id, name, team, country, format, ranking, status, score, tier, role from players order by score desc`;
    if (!rows.length) {
      await ensureAutoSynced();
      rows = await sql`select id, name, team, country, format, ranking, status, score, tier, role from players order by score desc`;
    }
    if (!rows.length) return mockPlayers;
    return rows as Player[];
  } catch {
    return mockPlayers;
  }
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const players = await listPlayers();
  return players.find((p) => p.id === id) ?? null;
}

export async function listMatches(): Promise<MatchItem[]> {
  if (!hasDb()) return mockMatches;
  try {
    const sql = getNeonSql();
    if (!sql) return mockMatches;
    let rows = await sql`select id, status, tournament, format, team1, team1_code as "team1Code", score1, overs1, team2, team2_code as "team2Code", score2, overs2, venue, result, ai_prediction as "aiPrediction" from matches order by start_time_utc desc nulls last, id desc`;
    if (!rows.length) {
      await ensureAutoSynced();
      rows = await sql`select id, status, tournament, format, team1, team1_code as "team1Code", score1, overs1, team2, team2_code as "team2Code", score2, overs2, venue, result, ai_prediction as "aiPrediction" from matches order by start_time_utc desc nulls last, id desc`;
    }
    if (!rows.length) return mockMatches;
    return rows as MatchItem[];
  } catch {
    return mockMatches;
  }
}

export async function getMatchById(id: string): Promise<MatchItem | null> {
  const matches = await listMatches();
  return matches.find((m) => m.id === id) ?? null;
}

export async function listTeams(): Promise<TeamItem[]> {
  if (!hasDb()) return mockTeams;
  try {
    const sql = getNeonSql();
    if (!sql) return mockTeams;
    let rows = await sql`select id, name, code, league, country, ranking, wins, losses, nrr, captain, players from teams order by ranking asc`;
    if (!rows.length) {
      await ensureAutoSynced();
      rows = await sql`select id, name, code, league, country, ranking, wins, losses, nrr, captain, players from teams order by ranking asc`;
    }
    if (!rows.length) return mockTeams;
    return rows as TeamItem[];
  } catch {
    return mockTeams;
  }
}

export async function listNews() {
  if (!hasDb()) return mockNews;
  try {
    const sql = getNeonSql();
    if (!sql) return mockNews;
    let rows = await sql`select id, tag, title, summary, time, reads from news order by source_updated_at desc nulls last, id desc`;
    if (!rows.length) {
      await ensureAutoSynced();
      rows = await sql`select id, tag, title, summary, time, reads from news order by source_updated_at desc nulls last, id desc`;
    }
    if (!rows.length) return mockNews;
    return rows;
  } catch {
    return mockNews;
  }
}

export async function listRankings(): Promise<RankingItem[]> {
  if (!hasDb()) return mockRankings;
  try {
    const sql = getNeonSql();
    if (!sql) return mockRankings;
    let rows = await sql`select id, player, country, format, rating, type from rankings order by rating desc`;
    if (!rows.length) {
      await ensureAutoSynced();
      rows = await sql`select id, player, country, format, rating, type from rankings order by rating desc`;
    }
    if (!rows.length) return mockRankings;
    return rows as RankingItem[];
  } catch {
    return mockRankings;
  }
}

export async function trackPlayerEvent(input: {
  playerId: string;
  eventType: string;
  source: string;
}): Promise<PlayerTrackingEvent> {
  const payload: PlayerTrackingEvent = {
    id: randomUUID(),
    playerId: input.playerId,
    eventType: input.eventType,
    source: input.source,
    createdAt: new Date().toISOString(),
  };

  if (!hasDb()) {
    trackingStore.unshift(payload);
    return payload;
  }

  try {
    const sql = getNeonSql();
    if (!sql) {
      trackingStore.unshift(payload);
      return payload;
    }

    await sql`
      insert into player_tracking_events (id, player_id, event_type, source, created_at)
      values (${payload.id}, ${payload.playerId}, ${payload.eventType}, ${payload.source}, ${payload.createdAt})
    `;
    return payload;
  } catch {
    trackingStore.unshift(payload);
    return payload;
  }
}

export async function listPlayerTrackingEvents(limit = 50): Promise<PlayerTrackingEvent[]> {
  if (!hasDb()) return trackingStore.slice(0, limit);
  try {
    const sql = getNeonSql();
    if (!sql) return trackingStore.slice(0, limit);
    const rows = await sql`
      select id, player_id as "playerId", event_type as "eventType", source, created_at as "createdAt"
      from player_tracking_events
      order by created_at desc
      limit ${limit}
    `;
    return rows as PlayerTrackingEvent[];
  } catch {
    return trackingStore.slice(0, limit);
  }
}
