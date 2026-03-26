# STUMPED AI — Cricket Intelligence System

A full-stack AI-powered cricket analytics platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

## 📁 Project Structure

```
stumped-ai/
├── app/
│   ├── auth/
│   │   └── sign-in/page.tsx          # Login page
│   ├── dashboard/
│   │   ├── layout.tsx                # Dashboard layout (sidebar + topnav)
│   │   ├── page.tsx                  # Main dashboard / radar
│   │   ├── news/page.tsx             # Match Intel news feed
│   │   ├── matches/
│   │   │   ├── page.tsx              # All matches scorecard
│   │   │   └── [id]/page.tsx         # Individual match detail
│   │   ├── players/
│   │   │   ├── page.tsx              # Player sensors list
│   │   │   └── [id]/page.tsx         # Player intelligence profile
│   │   ├── teams/page.tsx            # Team archive
│   │   ├── fantasy/page.tsx          # Fantasy XI optimizer
│   │   ├── rankings/page.tsx         # World rankings
│   │   ├── analytics/page.tsx        # AI sentiment monitor
│   │   └── live/page.tsx             # Live match tracker
│   ├── globals.css                   # Global styles + design tokens
│   └── layout.tsx                    # Root layout
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   ├── TopNav.tsx                # Top navigation bar
│   │   └── Footer.tsx                # Footer
│   └── charts/
│       ├── DashboardCharts.tsx       # Dashboard run rate + radar charts
│       ├── PlayerCharts.tsx          # Player form + stats charts
│       ├── MatchCharts.tsx           # Match worm + over bar charts
│       └── AnalyticsCharts.tsx       # Sentiment trend + pie charts
├── lib/
│   └── utils.ts                      # cn() utility
├── tailwind.config.ts                # Design tokens from Figma
└── package.json
```

## 🎨 Design System

- **Primary Font:** Epilogue (headings) + Space Grotesk (UI) + Inter (body)
- **Background:** `#131313` (base) · `#1b1b1b` (cards) · `#0e0e0e` (sidebar)
- **Accent:** `#2563eb` (blue) · `#b4c5ff` (light blue)
- **Text:** `#e2e2e2` (primary) · `#c3c6d7` (secondary)

## 🔌 Backend and Neon DB

The project now includes API routes and a Neon-ready data layer.

1. Copy `.env.example` to `.env.local` and fill values:

```bash
DATABASE_URL=postgres://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
CRICKET_PROVIDER=free-dev
```

2. Apply schema in Neon using `db/neon-schema.sql`.

3. Available API routes:

- `GET /api/bootstrap`
- `GET /api/players`
- `GET /api/players/[id]`
- `GET /api/matches`
- `GET /api/matches/[id]`
- `GET /api/teams`
- `GET /api/news`
- `GET /api/rankings`
- `GET /api/tracking/player`
- `POST /api/tracking/player`
- `POST /api/admin/sync-cricket`

When `DATABASE_URL` is not set, the app falls back to built-in mock data.

## 🌍 Real Data Pipeline (Free + Paid)

Use this exact sequence to run end-to-end with canonical DB sync.

1. Configure database and auth env vars in `.env.local`.
2. Set provider mode:
	- Free dev mode:
	  - `CRICKET_PROVIDER=free-dev`
	- Paid real-data mode:
	  - `CRICKET_PROVIDER=sportmonks`
	  - `SPORTMONKS_API_TOKEN=your_token`
	  - Optional override: `SPORTMONKS_BASE_URL=https://api.sportmonks.com/v3/cricket`

If `CRICKET_PROVIDER` is not set and `SPORTMONKS_API_TOKEN` is present, provider selection auto-switches to SportMonks.
3. Protect sync route:
	- Set `CRICKET_SYNC_SECRET=strong_random_secret`
4. Start app:

```bash
npm run dev
```

5. Trigger first ingestion sync:
	- PowerShell example:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/admin/sync-cricket" `
  -Headers @{ "x-sync-secret" = "YOUR_CRICKET_SYNC_SECRET" }
```

6. Verify data is now DB-backed:
	- `GET /api/matches`
	- `GET /api/players`
	- `GET /api/teams`
	- `GET /api/news`
	- `GET /api/rankings`

7. Open dashboard pages:
	- `/dashboard/matches` now reads from `/api/matches`
	- `/dashboard/live` now reads from `/api/matches` and refreshes periodically

## 🔑 Where To Get Credentials

1. Neon database URL:
	- Go to Neon Console: https://console.neon.tech
	- Create or open project -> Dashboard -> Connection Details
	- Copy pooled connection string into `DATABASE_URL`

2. Google OAuth client credentials:
	- Go to Google Cloud Console: https://console.cloud.google.com
	- APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
	- Authorized JavaScript origins: `http://localhost:3000` and/or your local port
	- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (use your active port)
	- Copy values into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

3. SportMonks cricket API token:
	- Go to SportMonks: https://www.sportmonks.com/cricket-api/
	- Create account, subscribe to a cricket plan, generate API token
	- Set `CRICKET_PROVIDER=sportmonks` and paste token into `SPORTMONKS_API_TOKEN`

## ⏱️ Production Sync Scheduling

Recommended baseline cadence:

1. `LIVE` fixtures: every 30-60 seconds
2. `UPCOMING` fixtures: every 2-5 minutes
3. Rankings/news/teams/players: every 15-60 minutes

If deploying on Vercel, schedule cron jobs to call `POST /api/admin/sync-cricket` with the `x-sync-secret` header.

## 📦 Dependencies

- **Next.js 15** — Framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Recharts** — Charts (run rate, sentiment, player DNA)
- **Lucide React** — Icons
- **clsx + tailwind-merge** — Class utilities

## 🤖 AI Features (Backend Required)

- Ball-by-ball commentary generation
- Match outcome prediction
- Fantasy XI optimization
- Sentiment analysis from social feeds
- Player DNA profiling
