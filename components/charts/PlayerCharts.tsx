"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

export default function PlayerCharts({
  recentForm,
  stats,
  dna,
}: {
  recentForm: string[];
  stats: { label: string; value: string }[];
  dna: { label: string; value: number }[];
}) {
  const formData = recentForm.map((score, i) => ({
    match: `M${i + 1}`,
    runs: parseInt(score.replace("*", "")) || 0,
    notOut: score.includes("*"),
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Recent form bar chart */}
      <div>
        <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-[rgba(195,198,215,0.4)] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          RECENT FORM TRAJECTORY
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={formData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" vertical={false} />
            <XAxis dataKey="match" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0 }}
              labelStyle={{ color: "#c3c6d7", fontSize: 10, fontFamily: "'Space Grotesk', sans-serif" }}
              itemStyle={{ color: "#b4c5ff", fontSize: 10, fontFamily: "'Space Grotesk', sans-serif" }}
            />
            <Bar dataKey="runs" fill="#2563eb" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Career stats grid */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-3">
            <p className="text-[8px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stat.label}
            </p>
            <p className="text-[16px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
