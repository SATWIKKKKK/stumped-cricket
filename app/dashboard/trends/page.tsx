"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, ResponsiveContainer,
} from "recharts";

/* ---------- mock data ---------- */
const xRunsData = [
  { over: "1", xRuns: 6, actual: 8 },
  { over: "5", xRuns: 28, actual: 32 },
  { over: "10", xRuns: 55, actual: 48 },
  { over: "15", xRuns: 82, actual: 90 },
  { over: "20", xRuns: 108, actual: 105 },
  { over: "25", xRuns: 130, actual: 128 },
  { over: "30", xRuns: 158, actual: 160 },
  { over: "35", xRuns: 188, actual: 192 },
  { over: "40", xRuns: 220, actual: 215 },
  { over: "45", xRuns: 260, actual: 270 },
  { over: "50", xRuns: 290, actual: 285 },
];

const impactScatter = [
  { x: 12, y: 85, name: "V. Kohli" },
  { x: 8, y: 72, name: "J. Buttler" },
  { x: 15, y: 91, name: "S. Smith" },
  { x: 6, y: 65, name: "B. Stokes" },
  { x: 18, y: 95, name: "R. Sharma" },
  { x: 10, y: 78, name: "K. Williamson" },
  { x: 4, y: 55, name: "D. Warner" },
  { x: 14, y: 88, name: "Babar Azam" },
  { x: 9, y: 70, name: "R. Pant" },
  { x: 20, y: 98, name: "T. Head" },
];

const eventLog = [
  { timestamp: "2025-01-15T14:32:00Z", event: "BOUNDARY_CLUSTER_DETECT", player: "V. Kohli", detail: "4 boundaries in 8 balls — aggressive phase shift detected.", severity: "HIGH" },
  { timestamp: "2025-01-15T14:28:00Z", event: "SPIN_DOMINANCE_ALERT", player: "R. Ashwin", detail: "Economy 3.2 in overs 15-25. Spin chokehold active.", severity: "MED" },
  { timestamp: "2025-01-15T14:22:00Z", event: "WICKET_PROBABILITY_SPIKE", player: "J. Bumrah", detail: "xWicket probability hit 0.42 on delivery 4.3.", severity: "CRIT" },
  { timestamp: "2025-01-15T14:15:00Z", event: "FIELD_SHIFT_ANOMALY", player: "Match", detail: "Unusual deep-square-leg deployment against left-hand bat.", severity: "LOW" },
  { timestamp: "2025-01-15T14:08:00Z", event: "POWERPLAY_SURGE_END", player: "Team IND", detail: "Powerplay yielded 62/1 — above xRuns projection by +8.", severity: "MED" },
  { timestamp: "2025-01-15T14:00:00Z", event: "PARTNERSHIP_MILESTONE", player: "Rohit & Kohli", detail: "100-run stand in 92 balls. Strike rotation efficiency 78%.", severity: "HIGH" },
];

const heroStats = [
  { label: "TOTAL MATCHES ANALYZED", value: "1,247", sub: "ACROSS 14 SERIES" },
  { label: "AVG PREDICTION ACCURACY", value: "87.3%", sub: "xRUNS MODEL V4.2" },
  { label: "SIGNAL ANOMALIES LOGGED", value: "3,891", sub: "LAST 90 DAYS" },
];

const seriesArchive = [
  "ICC World Cup 2023",
  "IPL 2024",
  "Ashes 2023",
  "Asia Cup 2023",
  "T20 World Cup 2024",
];

type DataFormat = "RAW" | "NORMALIZED" | "DELTA";

export default function TrendsPage() {
  const [dataFormat, setDataFormat] = useState<DataFormat>("RAW");
  const [playerFilter, setPlayerFilter] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string[]>(["ICC World Cup 2023", "IPL 2024"]);
  const [activeChart, setActiveChart] = useState<"xruns" | "impact">("xruns");

  const filteredScatter = useMemo(() => {
    if (!playerFilter.trim()) return impactScatter;
    return impactScatter.filter((p) =>
      p.name.toLowerCase().includes(playerFilter.toLowerCase())
    );
  }, [playerFilter]);

  const severityColor = (s: string) => {
    switch (s) {
      case "CRIT": return "text-[#ff4444]";
      case "HIGH": return "text-[#ff9f43]";
      case "MED": return "text-[#2563eb]";
      default: return "text-[rgba(226,226,226,0.4)]";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Title */}
      <div className="border-l-4 border-[#2563eb] pl-6">
        <p className="text-[10px] text-[#2563eb] tracking-[3px] mb-2 uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          HISTORICAL ANALYSIS ENGINE
        </p>
        <h1
          className="text-[36px] sm:text-[56px] lg:text-[72px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[0.9]"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          TREND
          <br />
          INTELLIGENCE
        </h1>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.3)] p-6 flex flex-col gap-2"
          >
            <span className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stat.label}
            </span>
            <span className="text-3xl font-black text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              {stat.value}
            </span>
            <span className="text-[10px] text-[#2563eb] tracking-[1px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Main Layout: Filters + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Filter Sidebar */}
        <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] p-5 flex flex-col gap-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <div>
            <label className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase block mb-2">DATA FORMAT</label>
            <select
              value={dataFormat}
              onChange={(e) => setDataFormat(e.target.value as DataFormat)}
              className="w-full bg-[#1b1b1b] border border-[rgba(67,70,85,0.4)] text-[#e2e2e2] text-xs px-3 py-2 outline-none focus:border-[#2563eb] uppercase tracking-[1px]"
            >
              <option value="RAW">RAW SIGNAL</option>
              <option value="NORMALIZED">NORMALIZED</option>
              <option value="DELTA">DELTA OVERLAY</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase block mb-2">PLAYER PROFILE</label>
            <input
              type="text"
              value={playerFilter}
              onChange={(e) => setPlayerFilter(e.target.value)}
              placeholder="ENTER CALLSIGN..."
              className="w-full bg-[#1b1b1b] border border-[rgba(67,70,85,0.4)] text-[#e2e2e2] text-xs px-3 py-2 outline-none focus:border-[#2563eb] uppercase tracking-[1px] placeholder-[rgba(226,226,226,0.2)]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase block mb-2">SERIES ARCHIVE</label>
            <div className="space-y-2">
              {seriesArchive.map((s) => (
                <label key={s} className="flex items-center gap-2 text-xs text-[#e2e2e2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSeries.includes(s)}
                    onChange={() =>
                      setSelectedSeries((prev) =>
                        prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                      )
                    }
                    className="accent-[#2563eb]"
                  />
                  <span className="uppercase tracking-[0.5px]">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#2563eb] text-white py-3 font-bold text-xs uppercase tracking-[2px] hover:bg-white hover:text-[#2563eb] transition-colors">
            APPLY FILTERS
          </button>
        </div>

        {/* Charts Area */}
        <div className="flex flex-col gap-6">
          {/* Chart Toggle */}
          <div className="flex gap-0 border border-[rgba(67,70,85,0.3)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <button
              onClick={() => setActiveChart("xruns")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-[2px] transition-colors ${
                activeChart === "xruns" ? "bg-[#2563eb] text-white" : "bg-[#1b1b1b] text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2]"
              }`}
            >
              xRUNS vs ACTUAL
            </button>
            <button
              onClick={() => setActiveChart("impact")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-[2px] transition-colors ${
                activeChart === "impact" ? "bg-[#2563eb] text-white" : "bg-[#1b1b1b] text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2]"
              }`}
            >
              IMPACT SCATTER
            </button>
          </div>

          {/* Chart Panel */}
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.3)] p-6">
            <p className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {activeChart === "xruns" ? "EXPECTED RUNS vs ACTUAL RUNS — OVER-BY-OVER PROJECTION" : "PLAYER IMPACT INDEX — MATCHES × PERFORMANCE RATING"}
            </p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === "xruns" ? (
                  <LineChart data={xRunsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.3)" />
                    <XAxis dataKey="over" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={{ stroke: "rgba(67,70,85,0.3)" }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={{ stroke: "rgba(67,70,85,0.3)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1b1b1b", border: "1px solid rgba(67,70,85,0.4)", fontSize: 11 }}
                      labelStyle={{ color: "#b4c5ff" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="xRuns" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: "#2563eb" }} name="xRuns (Projected)" />
                    <Line type="monotone" dataKey="actual" stroke="#b4c5ff" strokeWidth={2} dot={{ r: 3, fill: "#b4c5ff" }} name="Actual Runs" />
                  </LineChart>
                ) : (
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.3)" />
                    <XAxis type="number" dataKey="x" name="Matches" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={{ stroke: "rgba(67,70,85,0.3)" }} />
                    <YAxis type="number" dataKey="y" name="Rating" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={{ stroke: "rgba(67,70,85,0.3)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1b1b1b", border: "1px solid rgba(67,70,85,0.4)", fontSize: 11 }}
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(_val: unknown, name: string) => [String(_val), name]}
                      labelFormatter={() => ""}
                    />
                    <Scatter data={filteredScatter} fill="#2563eb" name="Players">
                      {filteredScatter.map((entry, i) => (
                        <circle key={i} r={6} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wagon Wheel + Pitch Density side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wagon Wheel */}
            <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.3)] p-6">
              <p className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                WAGON WHEEL — SCORING ZONES
              </p>
              <div className="aspect-square max-w-[320px] mx-auto">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  {/* Field circle */}
                  <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(67,70,85,0.3)" strokeWidth="1" />
                  <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(67,70,85,0.2)" strokeWidth="1" />
                  <circle cx="150" cy="150" r="40" fill="none" stroke="rgba(67,70,85,0.2)" strokeWidth="1" />
                  {/* Zone lines */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                      <line
                        key={angle}
                        x1="150"
                        y1="150"
                        x2={150 + 140 * Math.cos(rad)}
                        y2={150 + 140 * Math.sin(rad)}
                        stroke="rgba(67,70,85,0.15)"
                        strokeWidth="1"
                      />
                    );
                  })}
                  {/* Shot lines */}
                  {[
                    { angle: 20, length: 120, color: "#2563eb", width: 2 },
                    { angle: 55, length: 95, color: "#b4c5ff", width: 2 },
                    { angle: 110, length: 130, color: "#2563eb", width: 2.5 },
                    { angle: 160, length: 80, color: "#b4c5ff", width: 1.5 },
                    { angle: 200, length: 110, color: "#2563eb", width: 2 },
                    { angle: 250, length: 135, color: "#ff9f43", width: 3 },
                    { angle: 290, length: 100, color: "#b4c5ff", width: 2 },
                    { angle: 330, length: 125, color: "#2563eb", width: 2 },
                    { angle: 75, length: 140, color: "#ff9f43", width: 3 },
                    { angle: 140, length: 70, color: "#b4c5ff", width: 1.5 },
                  ].map((shot, i) => {
                    const rad = (shot.angle * Math.PI) / 180;
                    return (
                      <line
                        key={i}
                        x1="150"
                        y1="150"
                        x2={150 + shot.length * Math.cos(rad)}
                        y2={150 + shot.length * Math.sin(rad)}
                        stroke={shot.color}
                        strokeWidth={shot.width}
                        opacity={0.8}
                      />
                    );
                  })}
                  <circle cx="150" cy="150" r="4" fill="#e2e2e2" />
                </svg>
              </div>
            </div>

            {/* Pitch Density Map */}
            <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.3)] p-6">
              <p className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                PITCH DENSITY MAP — DELIVERY CLUSTERS
              </p>
              <div className="aspect-[3/4] max-w-[240px] mx-auto relative">
                <svg viewBox="0 0 200 280" className="w-full h-full">
                  {/* Pitch outline */}
                  <rect x="40" y="10" width="120" height="260" fill="none" stroke="rgba(67,70,85,0.3)" strokeWidth="1" />
                  {/* Crease lines */}
                  <line x1="40" y1="50" x2="160" y2="50" stroke="rgba(67,70,85,0.3)" strokeWidth="1" />
                  <line x1="40" y1="230" x2="160" y2="230" stroke="rgba(67,70,85,0.3)" strokeWidth="1" />
                  {/* Stumps */}
                  <rect x="85" y="228" width="30" height="4" fill="rgba(226,226,226,0.3)" />
                  <rect x="85" y="48" width="30" height="4" fill="rgba(226,226,226,0.3)" />
                  {/* Heat zones */}
                  <circle cx="100" cy="210" r="30" fill="url(#heatHigh)" opacity="0.7" />
                  <circle cx="115" cy="180" r="20" fill="url(#heatMed)" opacity="0.6" />
                  <circle cx="85" cy="190" r="15" fill="url(#heatLow)" opacity="0.5" />
                  <circle cx="105" cy="150" r="25" fill="url(#heatMed)" opacity="0.4" />
                  <circle cx="90" cy="120" r="18" fill="url(#heatLow)" opacity="0.35" />
                  {/* Delivery dots */}
                  {[
                    [95, 205], [105, 215], [98, 200], [110, 208], [92, 212],
                    [112, 185], [118, 175], [108, 190], [120, 180],
                    [82, 195], [88, 185], [80, 192],
                    [100, 155], [110, 145], [95, 150], [105, 140],
                    [88, 125], [92, 115], [85, 120],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="2.5" fill="#2563eb" opacity="0.9" />
                  ))}
                  <defs>
                    <radialGradient id="heatHigh">
                      <stop offset="0%" stopColor="#ff4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ff4444" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heatMed">
                      <stop offset="0%" stopColor="#ff9f43" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ff9f43" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heatLow">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Serial Log */}
      <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] p-6">
        <p className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          EVENT SERIAL LOG — REAL-TIME SIGNAL INTERCEPTS
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <thead>
              <tr className="border-b border-[rgba(67,70,85,0.3)]">
                <th className="text-left py-3 px-3 text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase">TIMESTAMP</th>
                <th className="text-left py-3 px-3 text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase">EVENT</th>
                <th className="text-left py-3 px-3 text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase">AGENT</th>
                <th className="text-left py-3 px-3 text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase">DETAIL</th>
                <th className="text-left py-3 px-3 text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] uppercase">SEV</th>
              </tr>
            </thead>
            <tbody>
              {eventLog.map((log, i) => (
                <tr key={i} className="border-b border-[rgba(67,70,85,0.15)] hover:bg-[rgba(37,99,235,0.05)] transition-colors">
                  <td className="py-3 px-3 text-[rgba(226,226,226,0.3)] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                  </td>
                  <td className="py-3 px-3 text-[#2563eb] font-bold whitespace-nowrap">{log.event}</td>
                  <td className="py-3 px-3 text-[#e2e2e2] whitespace-nowrap">{log.player}</td>
                  <td className="py-3 px-3 text-[rgba(226,226,226,0.5)] max-w-[400px]">{log.detail}</td>
                  <td className={`py-3 px-3 font-bold ${severityColor(log.severity)}`}>{log.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
