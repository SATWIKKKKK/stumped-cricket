"use client";

import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const radarData = [
  { skill: "Batting", p1: 96, p2: 93 },
  { skill: "Pressure", p1: 99, p2: 95 },
  { skill: "Clutch", p1: 98, p2: 94 },
  { skill: "Technique", p1: 95, p2: 97 },
  { skill: "Fitness", p1: 93, p2: 90 },
  { skill: "Footwork", p1: 97, p2: 92 },
];

const formData = [
  { match: "M1", p1: 100, p2: 67 },
  { match: "M2", p1: 72, p2: 89 },
  { match: "M3", p1: 45, p2: 34 },
  { match: "M4", p1: 88, p2: 112 },
  { match: "M5", p1: 0, p2: 52 },
  { match: "M6", p1: 121, p2: 78 },
];

export default function HeadToHeadCharts({ p1name, p2name }: { p1name: string; p2name: string }) {
  const p1Label = p1name.split(" ")[1] ?? p1name;
  const p2Label = p2name.split(" ")[1] ?? p2name;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Radar comparison */}
      <div className="bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            DNA COMPARISON
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(67,70,85,0.3)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(195,198,215,0.5)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} />
            <Radar name={p1Label} dataKey="p1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
            <Radar name={p2Label} dataKey="p2" stroke="#b4c5ff" fill="#b4c5ff" fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2">
          {[{ label: p1Label, color: "#2563eb" }, { label: p2Label, color: "#b4c5ff" }].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-3 h-0.5" style={{ background: l.color }} />
              <span className="text-[9px] uppercase text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent form comparison */}
      <div className="bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            RECENT FORM
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={formData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" vertical={false} />
            <XAxis dataKey="match" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0 }} />
            <Bar dataKey="p1" name={p1Label} fill="#2563eb" radius={0} />
            <Bar dataKey="p2" name={p2Label} fill="#b4c5ff" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
