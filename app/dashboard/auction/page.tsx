"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, DollarSign, Users, Target, Zap, BarChart2,
  ArrowUpRight, ArrowDownRight, ShieldAlert, Activity,
} from "lucide-react";
import type { Player } from "@/lib/server/types";

type AuctionTarget = {
  id: string;
  tag: string;
  name: string;
  role: string;
  type: string;
  badges: { label: string; accent: boolean }[];
  projectedPrice: string;
  valueIndex: string;
  synergyScore: number;
  image: string;
  restricted?: boolean;
};

const defaultTargets: AuctionTarget[] = [
  {
    id: "t1",
    tag: "#TARGET 011",
    name: "RAHUL KASHYAP",
    role: "RIGHT-HANDED BATSMAN",
    type: "BATSMEN",
    badges: [
      { label: "VETERAN", accent: false },
      { label: "CORE", accent: true },
    ],
    projectedPrice: "12.5M",
    valueIndex: "9.2 / 10",
    synergyScore: 88,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLJxYPC1bh00Z3jKFx3xgXT9vzcKZ5qYAcjyhLfQtilLivySbHB6jU2hMI-aGroz1_OS2MfUq92YVXq14KWcVSq_L2P0q2TUZSMWAB0SICN6PILjfBHYaj0xokeUyCoe3V3Jdxq0z44Dh5cYzaPHDbGqtlWqtApu18_-zivflROAaTKDjMxCIE6ZfyYTACBBAzVG4vW0iICQj8MtEFGwqM38N-xlCa9rABK3SSh-B5bgPfZ4mLsSD2ihxSlCcIkeiTMDIsD8J4EkA",
  },
  {
    id: "t2",
    tag: "#TARGET 042",
    name: "MARCUS THORNE",
    role: "LEFT-ARM FAST",
    type: "BOWLERS",
    badges: [
      { label: "OVERSEAS", accent: false },
      { label: "ELITE", accent: true },
    ],
    projectedPrice: "14.8M",
    valueIndex: "8.7 / 10",
    synergyScore: 94,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI21ifl0NW4-WyIRzhEHeXyxe_vDja0-aZVPh_s4pal3yOL5EqtGjZII32w_BtBdh4BjzVVDuxZEbGFOTZPIuZCjuO00UG_7ZFlmINWzrAjsrPQD2plPpb0jPunSKDNyhklOAV5nwIBrD7Pk6KnYO25Tox-h-w4MIAfoLXB7HaJORR4nwFJQDour-oJWBAiIplD8l763JYZ4DDUl6lA2ZYFaqttOZ948iuGn0eWYvYso7Vpl1T0uVeHa4u_CtrW570eytQb-Nb5fk",
  },
  {
    id: "t3",
    tag: "#TARGET 089",
    name: "SAM SPENCER",
    role: "WICKET-KEEPER BATSMAN",
    type: "BATSMEN",
    badges: [{ label: "EMERGING", accent: false }],
    projectedPrice: "4.5M",
    valueIndex: "LOW DATA",
    synergyScore: 0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtoAxYnD5N-zJlDIC4Kq0gkzMCNfN1EhqfGvydlLawNaegibA3M8OQ33KYhd1Ajk4CN2IbCFyDOCHZq_YTzWH07n2ZA0yaL8Ks45ciK1OhO3nqjK3eAX2-lPSffRJAK2nKlkT3A4J4bOxXuKKOiRVaMsBMInCUmEeRuqcsviaIqXIrd1r-c0IDPJHJpEYwPuF9VpyIwnyBo6AclCobT897MImTOmVgSgDkEGd6dOqfy_OA7hL9KbDuwQ6aXMrF6jjG8XTxo-yEcsE",
    restricted: true,
  },
];

const franchises = [
  { id: "AK", name: "ALPHA KINGS", purse: "32.8M", squad: "12/25", overseas: "04/08", bidMult: "+1.2x", bidTrend: "up", prob: "HIGH" },
  { id: "NS", name: "NEON STRIKERS", purse: "55.1M", squad: "08/25", overseas: "02/08", bidMult: "+2.8x", bidTrend: "up", prob: "CRITICAL" },
  { id: "VR", name: "VOX RAIDERS", purse: "18.4M", squad: "18/25", overseas: "06/08", bidMult: "0.9x", bidTrend: "down", prob: "LOW" },
];

const squadComposition = [
  { label: "BATSMEN", current: 4, max: 7 },
  { label: "BOWLERS", current: 3, max: 6 },
  { label: "ALL-ROUNDERS", current: 2, max: 4 },
  { label: "OVERSEAS", current: 3, max: 8 },
];

export default function AuctionStrategyPage() {
  const [strategy, setStrategy] = useState<"CONSERVATIVE" | "AGGRESSIVE">("CONSERVATIVE");
  const [targets] = useState(defaultTargets);
  const [players, setPlayers] = useState<Player[]>([]);
  const budgetTotal = 100;
  const budgetSpent = 54.8;
  const budgetRemaining = budgetTotal - budgetSpent;

  useEffect(() => {
    fetch("/api/players", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPlayers(d.data ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-6 sm:pl-7">
        <h1
          className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          Auction Strategy
        </h1>
        <span
          className="text-[11px] tracking-[3px] uppercase text-[rgba(226,226,226,0.35)] mt-2 block"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Squad Optimization // Budget Analysis // Target Valuation
        </span>
      </div>

      {/* Dashboard Header Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Squad Composition */}
        <div className="lg:col-span-2 bg-[#1b1b1b] p-6 relative overflow-hidden">
          <h2 className="text-2xl font-black mb-6 tracking-[-1px] text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            SQUAD COMPOSITION MATRIX
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {squadComposition.map((s) => (
              <div key={s.label} className="bg-[#0e0e0e] p-4 border-l-4 border-[#2563eb]">
                <span className="text-[10px] text-[#2563eb] tracking-[1px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {s.label}
                </span>
                <div className="text-3xl font-black text-[#e2e2e2] mt-1" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  {s.current.toString().padStart(2, "0")}{" "}
                  <span className="text-sm opacity-30">/ {s.max.toString().padStart(2, "0")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Efficiency */}
        <div className="bg-[#1b1b1b] p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-1px] mb-2 text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              BUDGET EFFICIENCY
            </h2>
            <p className="text-[10px] text-[#c3c6d7] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Remaining Liquidity
            </p>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-4xl font-black text-[#2563eb]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                {budgetRemaining.toFixed(1)}M
              </span>
              <span className="text-[10px] text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {budgetSpent}% DEPLETED
              </span>
            </div>
            <div className="h-4 bg-[#0e0e0e] w-full relative">
              <div className="h-full bg-[#2563eb]" style={{ width: `${budgetSpent}%` }} />
              <div className="absolute top-0 left-0 w-full h-full flex justify-between pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-px h-full bg-[#131313] opacity-30" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#2a2a2a] p-4 border-y border-[rgba(67,70,85,0.3)]">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#2563eb] tracking-[1px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              STRATEGY ENGINE
            </span>
            <span className="text-lg font-bold text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              AI STRATEGY OVERRIDE
            </span>
          </div>
          <div className="flex bg-[#0e0e0e] p-1">
            {(["CONSERVATIVE", "AGGRESSIVE"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStrategy(s)}
                className={`px-4 py-2 text-[10px] font-bold transition-all ${
                  strategy === s ? "bg-[#2563eb] text-white" : "text-[#e2e2e2] hover:bg-[#2a2a2a]"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-[#2563eb] text-white px-6 py-3 text-[10px] font-bold tracking-[2px] uppercase hover:brightness-110 transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            EXECUTE OPTIMIZATION
          </button>
          <button
            className="border-2 border-[#e2e2e2] text-[#e2e2e2] px-6 py-3 text-[10px] font-bold tracking-[2px] uppercase hover:bg-[#e2e2e2] hover:text-[#131313] transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            RECALIBRATE
          </button>
        </div>
      </div>

      {/* Top Target List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black tracking-[-2px] text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            TOP TARGET LIST
          </h2>
          <div className="flex items-center gap-2 text-[10px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="w-2 h-2 bg-[#2563eb] animate-pulse" />
            <span className="text-[#e2e2e2]">LIVE VALUATION STREAMING</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.map((target) => (
            <div
              key={target.id}
              className={`bg-[#1b1b1b] p-6 border-r-4 border-[#2563eb] group transition-all hover:bg-[#2a2a2a] ${
                target.restricted ? "opacity-50 grayscale hover:grayscale-0 hover:opacity-100 cursor-not-allowed" : ""
              }`}
            >
              {/* Player Header */}
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 bg-[#0e0e0e] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={target.image}
                    alt={target.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 border-2 border-[#2563eb] opacity-0 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {target.tag}
                  </span>
                  <h3 className="text-xl font-bold leading-none mt-1 text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                    {target.name}
                  </h3>
                  <p className="text-[10px] opacity-60 mt-2 text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {target.role}
                  </p>
                  <div className="mt-3 flex gap-1 flex-wrap">
                    {target.badges.map((b) => (
                      <span
                        key={b.label}
                        className={`px-2 py-0.5 text-[8px] font-bold ${
                          b.accent ? "bg-[#2563eb] text-white" : "bg-[#e2e2e2] text-[#131313]"
                        }`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#0e0e0e] p-2">
                  <span className="text-[10px] opacity-40 text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    PROJECTED PRICE
                  </span>
                  <span className="font-bold text-[#2563eb]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                    {target.projectedPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#0e0e0e] p-2">
                  <span className="text-[10px] opacity-40 text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    VALUE INDEX
                  </span>
                  <span className="font-bold text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                    {target.valueIndex}
                  </span>
                </div>
                <div className="pt-4 border-t border-[rgba(67,70,85,0.3)]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      SYNERGY SCORE
                    </span>
                    <span className="text-[10px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {target.synergyScore > 0 ? `${target.synergyScore}%` : "--%"}
                    </span>
                  </div>
                  <div className="h-1 bg-[#0e0e0e] w-full">
                    <div
                      className={`h-full ${target.synergyScore > 0 ? "bg-[#2563eb]" : "bg-[#e2e2e2] opacity-20"}`}
                      style={{ width: `${target.synergyScore || 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Volatility Tracker */}
      <div className="bg-[#0e0e0e] p-6 border-t-4 border-[#2563eb]">
        <div className="flex flex-wrap justify-between items-end mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black tracking-[-1px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              Market Volatility Tracker
            </h2>
            <p className="text-[10px] opacity-40 text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Real-time delta monitoring across competitor franchises
            </p>
          </div>
          <span className="text-[10px] text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            [ DATA STREAM STABLE ]
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <thead>
              <tr className="border-b border-[rgba(67,70,85,0.3)] text-[#2563eb]">
                {["FRANCHISE ID", "REMAINING PURSE", "SQUAD COUNT", "OVERSEAS FILLED", "AVG BID MULT", "ACTION PROB"].map((h) => (
                  <th key={h} className={`py-4 px-2 uppercase tracking-[1px] ${h === "ACTION PROB" ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(67,70,85,0.2)]">
              {franchises.map((f, i) => (
                <tr key={f.id} className="hover:bg-[#1b1b1b] transition-colors">
                  <td className="py-4 px-2 font-bold text-[#e2e2e2]">{f.name}</td>
                  <td className="py-4 px-2 text-[#e2e2e2]">{f.purse}</td>
                  <td className="py-4 px-2 text-[#e2e2e2]">{f.squad}</td>
                  <td className="py-4 px-2 text-[#e2e2e2]">{f.overseas}</td>
                  <td className={`py-4 px-2 ${f.bidTrend === "up" && f.prob === "CRITICAL" ? "text-[#ff453a]" : f.bidTrend === "up" ? "text-[#2563eb]" : "opacity-40 text-[#e2e2e2]"}`}>
                    {f.bidMult}
                  </td>
                  <td className={`py-4 px-2 text-right ${f.prob === "LOW" ? "opacity-40" : ""} text-[#e2e2e2]`}>
                    {f.prob}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Encryption Footer */}
      <div className="flex flex-wrap justify-between items-center px-2 py-2">
        <span className="text-[rgba(226,226,226,0.4)] text-[9px] tracking-[2px] uppercase font-mono">
          AES-256 ENCRYPTION ACTIVE // CLASSIFIED LOGS
        </span>
        <div className="flex items-center gap-2 text-[9px] text-[#2563eb] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
          CONNECTED SECTOR 07
        </div>
      </div>
    </div>
  );
}
