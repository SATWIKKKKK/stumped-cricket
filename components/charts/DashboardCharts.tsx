"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const runRateData = [
  { over: "P1", mi: 8.2, csk: 7.1 },
  { over: "P2", mi: 9.4, csk: 8.3 },
  { over: "P3", mi: 7.8, csk: 9.1 },
  { over: "P4", mi: 11.2, csk: 8.7 },
  { over: "P5", mi: 10.4, csk: 9.9 },
  { over: "P6", mi: 12.1, csk: 10.2 },
  { over: "M1", mi: 8.4, csk: 7.6 },
  { over: "M2", mi: 9.0, csk: 8.8 },
  { over: "M3", mi: 7.2, csk: 9.4 },
  { over: "D1", mi: 13.4, csk: 11.2 },
  { over: "D2", mi: 14.8, csk: 10.9 },
  { over: "D3", mi: 16.2, csk: 12.4 },
];

const wicketData = [
  { over: "Ov 3", wickets: 1 },
  { over: "Ov 7", wickets: 2 },
  { over: "Ov 11", wickets: 1 },
  { over: "Ov 14", wickets: 3 },
  { over: "Ov 17", wickets: 1 },
  { over: "Ov 19", wickets: 2 },
];

const playerSkillData = [
  { skill: "Batting", value: 96 },
  { skill: "Fielding", value: 88 },
  { skill: "Running", value: 92 },
  { skill: "Pressure", value: 99 },
  { skill: "Consistency", value: 94 },
  { skill: "Clutch", value: 97 },
];

const boundaryData = [
  { over: "PP", fours: 8, sixes: 3 },
  { over: "Mid-1", fours: 4, sixes: 1 },
  { over: "Mid-2", fours: 5, sixes: 2 },
  { over: "Mid-3", fours: 3, sixes: 0 },
  { over: "Death-1", fours: 6, sixes: 5 },
  { over: "Death-2", fours: 4, sixes: 7 },
];

const winProbData = [
  { over: "1", mi: 50, csk: 50 },
  { over: "3", mi: 55, csk: 45 },
  { over: "5", mi: 48, csk: 52 },
  { over: "8", mi: 42, csk: 58 },
  { over: "10", mi: 53, csk: 47 },
  { over: "12", mi: 60, csk: 40 },
  { over: "15", mi: 65, csk: 35 },
  { over: "17", mi: 58, csk: 42 },
  { over: "19", mi: 72, csk: 28 },
  { over: "20", mi: 78, csk: 22 },
];

const scoringBreakdown = [
  { name: "Singles", value: 42, color: "#2563eb" },
  { name: "Doubles", value: 18, color: "#3b82f6" },
  { name: "Fours", value: 56, color: "#60a5fa" },
  { name: "Sixes", value: 48, color: "#93c5fd" },
  { name: "Extras", value: 12, color: "#1d4ed8" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] px-3 py-2">
        <p className="text-[10px] tracking-[1px] text-[#c3c6d7] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-[11px] font-bold" style={{ color: p.color, fontFamily: "'Space Grotesk', sans-serif" }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Run rate area chart */}
      <div className="col-span-12 lg:col-span-8 bg-[#1b1b1b] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#b4c5ff]" />
            <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              MATCH RUN RATE [PHASE ANALYSIS]
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#2563eb]" />
              <span className="text-[9px] text-[rgba(195,198,215,0.6)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>MI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#b4c5ff]" />
              <span className="text-[9px] text-[rgba(195,198,215,0.6)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CSK</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={runRateData}>
            <defs>
              <linearGradient id="miGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b4c5ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#b4c5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="mi" name="MI" stroke="#2563eb" strokeWidth={2} fill="url(#miGrad)" dot={false} />
            <Area type="monotone" dataKey="csk" name="CSK" stroke="#b4c5ff" strokeWidth={2} fill="url(#cskGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          {["POWERPLAY", "MIDDLE", "DEATH"].map((phase, i) => (
            <div key={phase} className="flex-1 bg-[#0e0e0e] px-3 py-2 border-l-2 border-[#2563eb]">
              <p className="text-[9px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{phase}</p>
              <p className="text-[12px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {i === 0 ? "8.9 RR" : i === 1 ? "8.6 RR" : "14.5 RR"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Player radar */}
      <div className="col-span-12 lg:col-span-4 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            PLAYER DNA [VK 18]
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={playerSkillData}>
            <PolarGrid stroke="rgba(67,70,85,0.3)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(195,198,215,0.5)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} />
            <Radar name="Player" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-2 text-center">
            <p className="text-[24px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>96</p>
            <p className="text-[8px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>INTEL SCORE</p>
          </div>
          <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-2 text-center">
            <p className="text-[24px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>A+</p>
            <p className="text-[8px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TIER CLASS</p>
          </div>
        </div>
      </div>

      {/* Win Probability Line Chart */}
      <div className="col-span-12 lg:col-span-8 bg-[#1b1b1b] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#2563eb]" />
            <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              WIN PROBABILITY [OVER-BY-OVER]
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#2563eb]" />
              <span className="text-[9px] text-[rgba(195,198,215,0.6)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>MI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#b4c5ff]" />
              <span className="text-[9px] text-[rgba(195,198,215,0.6)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CSK</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={winProbData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="mi" name="MI" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: "#2563eb" }} />
            <Line type="monotone" dataKey="csk" name="CSK" stroke="#b4c5ff" strokeWidth={2} dot={{ r: 3, fill: "#b4c5ff" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scoring Breakdown Pie Chart */}
      <div className="col-span-12 lg:col-span-4 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#2563eb]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            SCORING BREAKDOWN
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={scoringBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {scoringBreakdown.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {scoringBreakdown.slice(0, 3).map((s) => (
            <div key={s.name} className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-2 text-center">
              <p className="text-[14px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
              <p className="text-[7px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.5px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Boundary Distribution Bar Chart */}
      <div className="col-span-12 lg:col-span-6 bg-[#1b1b1b] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#b4c5ff]" />
            <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              BOUNDARY DISTRIBUTION
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#2563eb] rounded-sm" />
              <span className="text-[9px] text-[rgba(195,198,215,0.6)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>4s</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#b4c5ff] rounded-sm" />
              <span className="text-[9px] text-[rgba(195,198,215,0.6)] uppercase tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>6s</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={boundaryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="fours" name="Fours" fill="#2563eb" radius={[2, 2, 0, 0]} />
            <Bar dataKey="sixes" name="Sixes" fill="#b4c5ff" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Wicket Fall Timeline */}
      <div className="col-span-12 lg:col-span-6 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-[#2563eb]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            WICKET FALL TIMELINE
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={wicketData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="wickets" name="Wickets" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-3 mt-3">
          <div className="flex-1 bg-[#0e0e0e] px-3 py-2 border-l-2 border-[#ef4444]">
            <p className="text-[9px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TOTAL WICKETS</p>
            <p className="text-[12px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>10</p>
          </div>
          <div className="flex-1 bg-[#0e0e0e] px-3 py-2 border-l-2 border-[#2563eb]">
            <p className="text-[9px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PEAK OVER</p>
            <p className="text-[12px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Over 14</p>
          </div>
        </div>
      </div>
    </div>
  );
}
