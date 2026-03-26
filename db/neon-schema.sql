-- Canonical provider-backed schema for real cricket ingestion

create table if not exists competitions (
  id text primary key,
  name text not null,
  short_name text,
  format text,
  country text,
  source_provider text not null,
  source_entity_id text not null,
  source_updated_at timestamptz,
  ingested_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb,
  unique (source_provider, source_entity_id)
);

create table if not exists seasons (
  id text primary key,
  competition_id text references competitions(id) on delete set null,
  name text not null,
  year integer,
  source_provider text not null,
  source_entity_id text not null,
  source_updated_at timestamptz,
  ingested_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb,
  unique (source_provider, source_entity_id)
);

create table if not exists venues (
  id text primary key,
  name text not null,
  city text,
  country text,
  source_provider text not null,
  source_entity_id text not null,
  source_updated_at timestamptz,
  ingested_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb,
  unique (source_provider, source_entity_id)
);

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
);

create unique index if not exists idx_teams_provider_entity
  on teams (source_provider, source_entity_id)
  where source_provider is not null and source_entity_id is not null;

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
);

create unique index if not exists idx_players_provider_entity
  on players (source_provider, source_entity_id)
  where source_provider is not null and source_entity_id is not null;

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
);

create unique index if not exists idx_matches_provider_entity
  on matches (source_provider, source_entity_id)
  where source_provider is not null and source_entity_id is not null;

create index if not exists idx_matches_start_time on matches(start_time_utc desc);
create index if not exists idx_matches_status on matches(status);

create table if not exists innings (
  id text primary key,
  match_id text not null references matches(id) on delete cascade,
  inning_number integer not null,
  batting_team text not null,
  runs integer not null,
  wickets integer not null,
  overs numeric(5,2) not null,
  source_provider text not null,
  source_entity_id text not null,
  source_updated_at timestamptz,
  ingested_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb,
  unique (source_provider, source_entity_id)
);

create table if not exists ball_events (
  id text primary key,
  match_id text not null references matches(id) on delete cascade,
  inning_number integer not null,
  over_no integer not null,
  ball_no integer not null,
  batter text,
  bowler text,
  runs integer not null default 0,
  extras integer not null default 0,
  wicket boolean not null default false,
  commentary text,
  source_provider text not null,
  source_entity_id text not null,
  source_updated_at timestamptz,
  ingested_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb,
  unique (source_provider, source_entity_id)
);

create index if not exists idx_ball_events_match_over_ball
  on ball_events(match_id, inning_number, over_no, ball_no);

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
);

create unique index if not exists idx_rankings_provider_entity
  on rankings (source_provider, source_entity_id)
  where source_provider is not null and source_entity_id is not null;

create index if not exists idx_rankings_format_type on rankings(format, type);

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
);

create unique index if not exists idx_news_provider_entity
  on news (source_provider, source_entity_id)
  where source_provider is not null and source_entity_id is not null;

create table if not exists player_tracking_events (
  id text primary key,
  player_id text not null,
  event_type text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id text primary key,
  name text not null,
  email text not null unique,
  player_id text not null unique,
  role text not null default 'user',
  password_hash text,
  provider text not null,
  created_at timestamptz not null default now()
);
