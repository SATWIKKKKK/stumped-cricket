"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Radio, Grid3X3, Activity, Archive, Users,
  BarChart2, Trophy, Zap, Settings, LogOut, X, Radar, Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/radar", icon: Radar, label: "RADAR" },
  { href: "/dashboard/player-intelligence", icon: Users, label: "SENSORS" },
  { href: "/dashboard/terminal", icon: Terminal, label: "TERMINAL" },
  { href: "/dashboard/archive", icon: Archive, label: "ARCHIVE" },
  { href: "/dashboard", icon: Radio, label: "MATCH CENTRE", exact: true },
  { href: "/dashboard/live", icon: Activity, label: "LIVE MATCH" },
  { href: "/dashboard/matches", icon: Grid3X3, label: "SCORECARD" },
  { href: "/dashboard/schedule", icon: Grid3X3, label: "FIXTURE GRID" },
  { href: "/dashboard/players", icon: Users, label: "PLAYERS" },
  { href: "/dashboard/teams", icon: Trophy, label: "TEAMS" },
  { href: "/dashboard/head-to-head", icon: BarChart2, label: "HEAD TO HEAD" },
  { href: "/dashboard/leaderboard", icon: Trophy, label: "LEADERBOARD" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "SENTIMENT" },
  { href: "/dashboard/fantasy", icon: Zap, label: "FANTASY XI" },
  { href: "/dashboard/rankings", icon: Trophy, label: "RANKINGS" },
  { href: "/dashboard/news", icon: Archive, label: "CRICKET NEWS" },
  { href: "/dashboard/settings", icon: Settings, label: "CRICKET SETTINGS" },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0e0e0e] flex flex-col h-full border-r border-[rgba(67,70,85,0.1)]">
      {/* Logo */}
      <div className="border-b border-[rgba(67,70,85,0.1)] px-6 py-6 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <Link href="/dashboard" onClick={onClose}>
            <h1
              className="text-[18px] font-black tracking-[-0.9px] uppercase text-[#e2e2e2] hover:text-[#b4c5ff] transition-colors truncate"
              style={{ fontFamily: "'Epilogue', sans-serif" }}
            >
              PAVILION HQ
            </h1>
          </Link>
          <span
            className="text-[10px] tracking-[1px] text-[rgba(195,198,215,0.4)] uppercase truncate"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ELITE MATCHDAY DESK
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors p-1 shrink-0 mt-1"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-3 mx-1 transition-all",
                isActive
                  ? "bg-[#2563eb] text-white"
                  : "text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] hover:bg-[rgba(37,99,235,0.1)]"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span
                className="text-[12px] font-bold tracking-[1.2px] uppercase flex-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.label}
              </span>
              {item.label === "LIVE MATCH" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#b4c5ff] status-live" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[rgba(67,70,85,0.1)] px-5 py-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[1px] text-[rgba(226,226,226,0.4)] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              PITCH READINESS
            </span>
            <span className="text-[10px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              98.4%
            </span>
          </div>
          <div className="h-1 bg-[#353535] flex gap-0.5 overflow-hidden">
            <div className="h-full bg-[#b4c5ff] flex-1" />
            <div className="h-full bg-[#b4c5ff] flex-1" />
            <div className="h-full bg-[#b4c5ff] flex-1" />
            <div className="h-full bg-[rgba(180,197,255,0.4)] w-8" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2a2a2a] border border-[rgba(67,70,85,0.2)] flex items-center justify-center shrink-0">
            <Settings size={13} className="text-[#c3c6d7]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#e2e2e2] truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ANALYST ID 72
            </span>
            <span className="text-[8px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              MATCHDAY ACCESS
            </span>
          </div>
        </div>

        <div className="flex gap-5">
          <Link href="/dashboard/encrypt" className="flex items-center gap-1.5 text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors">
            <Settings size={10} />
            <span className="text-[10px] tracking-[1px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ENCRYPT</span>
          </Link>
          <Link href="/auth/sign-in" className="flex items-center gap-1.5 text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] transition-colors">
            <LogOut size={10} />
            <span className="text-[10px] tracking-[1px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LOGOUT</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
