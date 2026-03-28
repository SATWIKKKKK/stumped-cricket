"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search, Bell, Settings, Menu, UserCircle2, LogOut, X,
  Radio, Activity, Grid3X3, Users, BarChart2, Trophy, Zap,
  Radar, Terminal, Archive, Globe, MessageSquare, Map, Swords,
  Sun, Moon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/lib/ThemeContext";

const navSections = [
  {
    title: "Live & Matches",
    items: [
      { href: "/dashboard", icon: Radio, label: "Match Centre" },
      { href: "/dashboard/live", icon: Activity, label: "Live Match" },
      { href: "/dashboard/matches", icon: Grid3X3, label: "Scorecard" },
      { href: "/dashboard/schedule", icon: Grid3X3, label: "Fixture Grid" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { href: "/dashboard/players", icon: Users, label: "Players" },
      { href: "/dashboard/teams", icon: Trophy, label: "Teams" },
      { href: "/dashboard/head-to-head", icon: Swords, label: "Head to Head" },
      { href: "/dashboard/rankings", icon: Trophy, label: "Rankings" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { href: "/dashboard/analytics", icon: BarChart2, label: "Stats Explorer" },
      { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard" },
      { href: "/dashboard/fantasy", icon: Zap, label: "Fantasy XI" },
      { href: "/dashboard/radar", icon: Radar, label: "Radar" },
      { href: "/dashboard/trends", icon: Activity, label: "Trends" },
      { href: "/dashboard/narrative", icon: Archive, label: "Match Narrative" },
      { href: "/dashboard/bowling-load", icon: Activity, label: "Bowling Load" },
    ],
  },
  {
    title: "Community",
    items: [
      { href: "/dashboard/news", icon: Archive, label: "Cricket News" },
      { href: "/dashboard/network", icon: Globe, label: "Community Hub" },
      { href: "/dashboard/terminal", icon: MessageSquare, label: "Stump Bot" },
    ],
  },
  {
    title: "Simulations",
    items: [
      { href: "/dashboard/drs", icon: Radar, label: "DRS Simulator" },
      { href: "/dashboard/trajectory", icon: Activity, label: "Ball Trajectory" },
      { href: "/dashboard/field-ops", icon: Grid3X3, label: "Field Placement" },
      { href: "/dashboard/auction", icon: Zap, label: "Auction Strategy" },
    ],
  },
  {
    title: "Venues & Data",
    items: [
      { href: "/dashboard/alerts", icon: Map, label: "Venue Intel" },
      { href: "/dashboard/archive", icon: Archive, label: "Archive" },
      { href: "/dashboard/logs", icon: Terminal, label: "System Logs" },
      { href: "/dashboard/pricing", icon: Zap, label: "Intel Tiers" },
    ],
  },
];

const routeLabels: Record<string, string> = {
  "/dashboard": "MATCH CENTRE",
  "/dashboard/radar": "MATCH RADAR",
  "/dashboard/player-intelligence": "PLAYER INTELLIGENCE",
  "/dashboard/terminal": "STUMP BOT",
  "/dashboard/archive": "MATCH ARCHIVE",
  "/dashboard/network": "COMMUNITY HUB",
  "/dashboard/alerts": "VENUE INTEL",
  "/dashboard/logs": "SYSTEM LOGS",
  "/dashboard/privacy": "FAN PLAY POLICY",
  "/dashboard/matches": "SCORECARD GRID",
  "/dashboard/live": "LIVE MATCH",
  "/dashboard/schedule": "FIXTURE GRID",
  "/dashboard/players": "PLAYER SENSORS",
  "/dashboard/teams": "TEAM ARCHIVE",
  "/dashboard/head-to-head": "HEAD TO HEAD",
  "/dashboard/leaderboard": "FORM LEADERBOARD",
  "/dashboard/analytics": "STATS EXPLORER",
  "/dashboard/fantasy": "FANTASY XI",
  "/dashboard/rankings": "WORLD RANKINGS",
  "/dashboard/news": "CRICKET NEWS",
  "/dashboard/settings": "CRICKET SETTINGS",
  "/dashboard/drs": "DRS SIMULATOR",
  "/dashboard/auction": "AUCTION STRATEGY",
  "/dashboard/trajectory": "BALL TRAJECTORY",
  "/dashboard/field-ops": "FIELD PLACEMENT",
  "/dashboard/pricing": "INTEL TIERS",
  "/dashboard/trends": "TREND INTELLIGENCE",
  "/dashboard/narrative": "MATCH NARRATIVE",
  "/dashboard/bowling-load": "BOWLING LOAD TRACKER",
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();

  const pageLabel =
    Object.entries(routeLabels).find(([route]) =>
      route === pathname || (route !== "/dashboard" && pathname.startsWith(route))
    )?.[1] ?? "STUMPED AI";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[69px] bg-[#0e0e0e] border-b border-[rgba(67,70,85,0.1)] z-50 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <Link href="/dashboard" className="shrink-0">
            <h1 className="text-[16px] sm:text-[20px] font-black tracking-[-1px] uppercase text-[#e2e2e2] hover:text-[#b4c5ff] transition-colors" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              STUMPED AI
            </h1>
          </Link>

          <div className="hidden sm:block w-px h-5 bg-[rgba(67,70,85,0.3)]" />

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 transition-all ${dropdownOpen ? "bg-[#2563eb] text-white" : "text-[rgba(226,226,226,0.6)] hover:text-[#e2e2e2] hover:bg-[rgba(37,99,235,0.1)]"}`}
            >
              {dropdownOpen ? <X size={14} /> : <Menu size={14} />}
              <span className="text-[10px] font-bold tracking-[1.2px] uppercase hidden sm:inline" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Navigate
              </span>
            </button>

            {dropdownOpen && (
              <div className="fixed inset-x-0 top-[69px] bottom-0 glass-overlay z-40 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6 sm:p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {navSections.map((section) => (
                      <div key={section.title}>
                        <h3 className="text-[10px] font-bold tracking-[2px] uppercase text-[#b4c5ff] mb-4 pb-2 border-b border-[rgba(180,197,255,0.15)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {section.title}
                        </h3>
                        <div className="flex flex-col gap-1">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.href === "/dashboard"
                              ? pathname === item.href
                              : pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 transition-all ${isActive ? "bg-[#2563eb] text-white" : "text-[rgba(226,226,226,0.5)] hover:text-[#e2e2e2] hover:bg-[rgba(255,255,255,0.05)]"}`}
                              >
                                <Icon size={16} className="shrink-0" />
                                <span className="text-[12px] font-bold tracking-[1px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                  {item.label}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-6 border-t border-[rgba(67,70,85,0.2)] flex flex-wrap gap-3">
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] text-[rgba(226,226,226,0.5)] hover:text-[#e2e2e2] transition-colors">
                      <Settings size={14} />
                      <span className="text-[10px] font-bold tracking-[1px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Settings</span>
                    </Link>
                    <Link href="/dashboard/privacy" className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] text-[rgba(226,226,226,0.5)] hover:text-[#e2e2e2] transition-colors">
                      <Archive size={14} />
                      <span className="text-[10px] font-bold tracking-[1px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Privacy Policy</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[12px] font-bold tracking-[0.5px] uppercase text-[rgba(226,226,226,0.6)]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              {pageLabel}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-4 bg-[rgba(67,70,85,0.3)]" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#b4c5ff] status-live" />
              <span className="text-[10px] font-bold tracking-[1px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LIVE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <div className="hidden md:flex bg-[#1f1f1f] border-b border-[#b4c5ff] items-center gap-2 px-3 py-2">
            <Search size={12} className="text-[#6b7280] shrink-0" />
            <input type="text" placeholder="SEARCH..." className="bg-transparent text-[10px] tracking-[1px] uppercase text-[#e2e2e2] placeholder-[#6b7280] outline-none w-36 lg:w-44 border-none focus:ring-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }} />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link href="/dashboard/alerts" className="text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors relative" aria-label="Alerts">
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#2563eb] rounded-full" />
            </Link>
            <Link href="/dashboard/settings" className="hidden sm:block text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors" aria-label="Settings">
              <Settings size={16} />
            </Link>
            <div className="relative">
              <button onClick={() => setMenuOpen((prev) => !prev)} className="text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors" aria-label="Profile menu">
                <UserCircle2 size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1b1b1b] border border-[rgba(67,70,85,0.4)] shadow-xl p-2 z-50">
                  <Link href="/auth/sign-in" className="block px-3 py-2 text-[11px] uppercase tracking-[1px] text-[#c3c6d7] hover:text-[#e2e2e2] hover:bg-[#2a2a2a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }} onClick={() => setMenuOpen(false)}>Sign In</Link>
                  <Link href="/auth/sign-up" className="block px-3 py-2 text-[11px] uppercase tracking-[1px] text-[#c3c6d7] hover:text-[#e2e2e2] hover:bg-[#2a2a2a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
                  <button onClick={() => signOut({ callbackUrl: "/auth/sign-in" })} className="w-full text-left px-3 py-2 text-[11px] uppercase tracking-[1px] text-[#ff9f9f] hover:text-[#ffd0d0] hover:bg-[#2a2a2a] flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <LogOut size={12} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
