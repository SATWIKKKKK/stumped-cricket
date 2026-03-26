"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Settings, Wifi, Menu, UserCircle2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const routeLabels: Record<string, string> = {
  "/dashboard": "MATCH CENTRE",
  "/dashboard/radar": "MATCH RADAR",
  "/dashboard/player-intelligence": "PLAYER INTELLIGENCE",
  "/dashboard/terminal": "CRICKET TERMINAL",
  "/dashboard/archive": "MATCH ARCHIVE",
  "/dashboard/network": "NETWORK PULSE",
  "/dashboard/alerts": "MATCH ALERTS",
  "/dashboard/logs": "MATCH LOGS",
  "/dashboard/privacy": "FAN PLAY POLICY",
  "/dashboard/matches": "SCORECARD GRID",
  "/dashboard/live": "LIVE MATCH",
  "/dashboard/schedule": "FIXTURE GRID",
  "/dashboard/players": "PLAYER SENSORS",
  "/dashboard/teams": "TEAM ARCHIVE",
  "/dashboard/head-to-head": "HEAD TO HEAD",
  "/dashboard/leaderboard": "FORM LEADERBOARD",
  "/dashboard/analytics": "SENTIMENT MONITOR",
  "/dashboard/fantasy": "FANTASY XI",
  "/dashboard/rankings": "WORLD RANKINGS",
  "/dashboard/news": "CRICKET NEWS",
  "/dashboard/settings": "CRICKET SETTINGS",
};

export default function TopNav({
  onMenuClick,
  sidebarEnabled,
}: {
  onMenuClick?: () => void;
  sidebarEnabled?: boolean;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const pageLabel =
    Object.entries(routeLabels).find(([route]) =>
      route === pathname || (route !== "/dashboard" && pathname.startsWith(route))
    )?.[1] ?? "STUMPED AI";

  return (
    <header
      className={`fixed top-0 right-0 h-[69px] bg-[#0e0e0e] border-b border-[rgba(67,70,85,0.1)] z-30 flex items-center justify-between px-4 sm:px-6 transition-[left] duration-300 ${
        sidebarEnabled ? "left-0 lg:left-64" : "left-0"
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="text-[rgba(226,226,226,0.6)] hover:text-[#e2e2e2] transition-colors p-1 shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col min-w-0">
          <h2
            className="text-[16px] sm:text-[20px] font-bold tracking-[-1px] uppercase text-[#e2e2e2] truncate"
            style={{ fontFamily: "'Epilogue', sans-serif" }}
          >
            {pageLabel}
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-px h-4 bg-[rgba(67,70,85,0.3)]" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#b4c5ff] status-live" />
            <span
              className="text-[10px] font-bold tracking-[1px] text-[#b4c5ff]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              LIVE FEED: ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        {/* Search hidden on small screens */}
        <div className="hidden md:flex bg-[#1f1f1f] border-b border-[#b4c5ff] items-center gap-2 px-3 py-2">
          <Search size={12} className="text-[#6b7280] shrink-0" />
          <input
            type="text"
            placeholder="SEARCH..."
            className="bg-transparent text-[10px] tracking-[1px] uppercase text-[#e2e2e2] placeholder-[#6b7280] outline-none w-36 lg:w-44"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/network" className="hidden sm:block text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors" aria-label="Network status">
            <Wifi size={16} />
          </Link>
          <Link href="/dashboard/alerts" className="text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors relative" aria-label="Alerts">
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#2563eb] rounded-full" />
          </Link>
          <Link href="/dashboard/settings" className="text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors" aria-label="Settings">
            <Settings size={16} />
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors"
              aria-label="Profile menu"
            >
              <UserCircle2 size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1b1b1b] border border-[rgba(67,70,85,0.4)] shadow-xl p-2 z-50">
                <Link
                  href="/auth/sign-in"
                  className="block px-3 py-2 text-[11px] uppercase tracking-[1px] text-[#c3c6d7] hover:text-[#e2e2e2] hover:bg-[#2a2a2a]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="block px-3 py-2 text-[11px] uppercase tracking-[1px] text-[#c3c6d7] hover:text-[#e2e2e2] hover:bg-[#2a2a2a]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
                  className="w-full text-left px-3 py-2 text-[11px] uppercase tracking-[1px] text-[#ff9f9f] hover:text-[#ffd0d0] hover:bg-[#2a2a2a] flex items-center gap-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <LogOut size={12} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
