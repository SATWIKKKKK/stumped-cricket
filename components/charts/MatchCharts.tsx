"use client";

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const overData = Array.from({ length: 18 }, (_, i) => ({
  over: i + 1,
  runs: Math.floor(Math.random() * 15) + 4,
  wickets: Math.random() > 0.8 ? 1 : 0,
  runRate: (Math.random() * 8 + 6).toFixed(1),
}));

const wormData = [
  { over: 1, mi: 8, csk: 0 }, { over: 2, mi: 19, csk: 0 },
  { over: 3, mi: 32, csk: 0 }, { over: 4, mi: 48, csk: 0 },
  { over: 5, mi: 59, csk: 0 }, { over: 6, mi: 74, csk: 0 },
  { over: 7, mi: 84, csk: 0 }, { over: 8, mi: 96, csk: 0 },
  { over: 9, mi: 108, csk: 0 }, { over: 10, mi: 118, csk: 0 },
  { over: 11, mi: 130, csk: 0 }, { over: 12, mi: 140, csk: 0 },
  { over: 13, mi: 151, csk: 0 }, { over: 14, mi: 161, csk: 0 },
  { over: 15, mi: 169, csk: 0 }, { over: 16, mi: 176, csk: 0 },
  { over: 17, mi: 183, csk: 0 }, { over: 18, mi: 187, csk: 0 },
  { over: 1, mi: 187, csk: 9 }, { over: 2, mi: 187, csk: 22 },
  { over: 5, mi: 187, csk: 54 }, { over: 10, mi: 187, csk: 89 },
  { over: 15, mi: 187, csk: 120 }, { over: 17, mi: 187, csk: 142 },
];

const cskWorm = [
  { over: 1, csk: 9 }, { over: 2, csk: 22 }, { over: 3, csk: 35 },
  { over: 5, csk: 54 }, { over: 7, csk: 72 }, { over: 10, csk: 89 },
  { over: 12, csk: 104 }, { over: 14, csk: 120 }, { over: 16, csk: 134 }, { over: 17, csk: 142 },
];

export default function MatchCharts() {
  return (
    <div className="bg-[#1b1b1b] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            RUN PROGRESSION [WORM]
          </span>
        </div>
        <div className="flex gap-3">
          {[{ label: "MI", color: "#2563eb" }, { label: "CSK", color: "#b4c5ff" }].map(t => (
            <div key={t.label} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5" style={{ background: t.color }} />
              <span className="text-[9px] uppercase tracking-[0.8px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Over bar chart */}
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={overData} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" vertical={false} />
          <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} label={{ value: "OVER", position: "insideBottom", offset: -2, fill: "rgba(195,198,215,0.2)", fontSize: 8 }} />
          <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0 }}
            labelStyle={{ color: "#c3c6d7", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }}
            itemStyle={{ color: "#b4c5ff", fontSize: 9 }}
            formatter={(v: any) => [`${v} runs`, "RUNS"]}
          />
          <Bar dataKey="runs" fill="#2563eb" radius={0} />
        </BarChart>
      </ResponsiveContainer>

      {/* Worm chart */}
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={cskWorm}>
          <defs>
            <linearGradient id="cskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b4c5ff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#b4c5ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
          <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0 }}
            itemStyle={{ color: "#b4c5ff", fontSize: 9 }}
          />
          <ReferenceLine y={187} stroke="rgba(37,99,235,0.4)" strokeDasharray="4 4" label={{ value: "TARGET", fill: "rgba(37,99,235,0.5)", fontSize: 8, fontFamily: "'Space Grotesk', sans-serif" }} />
          <Area type="monotone" dataKey="csk" name="CSK" stroke="#b4c5ff" fill="url(#cskGrad)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
