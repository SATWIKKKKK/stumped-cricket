"use client";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const sentimentTrend = [
  { time: "08:00", positive: 72, negative: 12 }, { time: "09:00", positive: 78, negative: 10 },
  { time: "10:00", positive: 75, negative: 15 }, { time: "11:00", positive: 82, negative: 8 },
  { time: "12:00", positive: 84, negative: 8 }, { time: "12:30", positive: 89, negative: 6 },
];

const volumeData = [
  { platform: "Twitter", volume: 4200 }, { platform: "Reddit", volume: 1800 },
  { platform: "Instagram", volume: 940 }, { platform: "YouTube", volume: 620 },
  { platform: "Telegram", volume: 340 },
];

const pieData = [
  { name: "Positive", value: 84 }, { name: "Negative", value: 8 }, { name: "Neutral", value: 8 },
];
const COLORS = ["#2563eb", "#ff453a", "#353535"];

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Sentiment trend */}
      <div className="col-span-2 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            SENTIMENT TIMELINE [TODAY]
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={sentimentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="time" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0 }} />
            <Line type="monotone" dataKey="positive" name="Positive" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="negative" name="Negative" stroke="#ff453a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sentiment breakdown pie */}
      <div className="bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            SENTIMENT SPLIT
          </span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 mt-2">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-[9px] uppercase text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{d.name}</span>
              </div>
              <span className="text-[11px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
