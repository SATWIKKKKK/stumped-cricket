"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Map, Droplets, Wind, Thermometer, Cloud, Sun,
  TrendingUp, Activity, BarChart2, Eye, Gauge, Shield,
  Waves, Compass, Globe, Star,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { useTheme } from "@/lib/ThemeContext";
import type { MatchItem } from "@/lib/server/types";

/* ---------- venue data ---------- */
const venues = [
  { id: "wankhede", name: "Wankhede Stadium", city: "Mumbai", capacity: "33,000", avgScore: 168, paceFriendly: 58, spinFriendly: 42, established: 1974, altitude: "14m", historyRank: 4, clayContent: 32, uvIndex: 7.2, dewProbability: 68, atmosphericPressure: 1013 },
  { id: "chinnaswamy", name: "M Chinnaswamy Stadium", city: "Bengaluru", capacity: "40,000", avgScore: 182, paceFriendly: 45, spinFriendly: 55, established: 1969, altitude: "920m", historyRank: 6, clayContent: 28, uvIndex: 8.1, dewProbability: 42, atmosphericPressure: 908 },
  { id: "eden", name: "Eden Gardens", city: "Kolkata", capacity: "68,000", avgScore: 158, paceFriendly: 52, spinFriendly: 48, established: 1864, altitude: "9m", historyRank: 1, clayContent: 35, uvIndex: 6.5, dewProbability: 74, atmosphericPressure: 1012 },
  { id: "chepauk", name: "MA Chidambaram Stadium", city: "Chennai", capacity: "50,000", avgScore: 155, paceFriendly: 38, spinFriendly: 62, established: 1916, altitude: "6m", historyRank: 2, clayContent: 41, uvIndex: 8.8, dewProbability: 58, atmosphericPressure: 1010 },
  { id: "narendra", name: "Narendra Modi Stadium", city: "Ahmedabad", capacity: "132,000", avgScore: 162, paceFriendly: 50, spinFriendly: 50, established: 1982, altitude: "53m", historyRank: 3, clayContent: 30, uvIndex: 7.9, dewProbability: 35, atmosphericPressure: 1006 },
];

function buildPitchData() {
  return {
    soilMoisture: Math.floor(Math.random() * 20 + 25),
    grassCoverage: Math.floor(Math.random() * 30 + 15),
    surfaceHardness: Math.floor(Math.random() * 25 + 55),
    crackIndex: +(Math.random() * 3 + 1).toFixed(1),
    dewFactor: Math.floor(Math.random() * 40 + 20),
    bounceCoeff: +(Math.random() * 0.4 + 0.6).toFixed(2),
  };
}

const bounceData = Array.from({ length: 20 }, (_, i) => ({
  over: i + 1,
  bounce: +(Math.random() * 0.3 + 0.5).toFixed(2),
  seam: +(Math.random() * 0.2 + 0.1).toFixed(2),
}));

const weatherData = {
  temperature: Math.floor(Math.random() * 10 + 28),
  humidity: Math.floor(Math.random() * 30 + 50),
  windSpeed: Math.floor(Math.random() * 15 + 5),
  windDirection: "NW",
  condition: "Partly Cloudy",
  rainChance: Math.floor(Math.random() * 20),
};

const historicalScores = Array.from({ length: 10 }, (_, i) => ({
  match: `Match ${i + 1}`,
  firstInnings: Math.floor(Math.random() * 50 + 140),
  secondInnings: Math.floor(Math.random() * 50 + 135),
}));

export default function VenueIntelPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [selectedVenue, setSelectedVenue] = useState(venues[0]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const res = await fetch("/api/matches", { cache: "no-store" });
      const data = (await res.json()) as { data?: MatchItem[] };
      if (!ignore) setMatches(data.data ?? []);
    }
    load();
    return () => { ignore = true; };
  }, []);

  const pitchData = useMemo(() => buildPitchData(), [selectedVenue]);

  const venueMatches = useMemo(() => {
    return matches.filter((m) =>
      m.venue.toLowerCase().includes(selectedVenue.city.toLowerCase()) ||
      m.venue.toLowerCase().includes(selectedVenue.name.toLowerCase())
    );
  }, [matches, selectedVenue]);

  const cardBg = dark ? "#1b1b1b" : "#ffffff";
  const deepBg = dark ? "#0e0e0e" : "#f5f5f5";
  const text = dark ? "#e2e2e2" : "#1a1a1a";
  const sub = dark ? "rgba(195,198,215,0.5)" : "rgba(60,60,60,0.5)";
  const subLight = dark ? "rgba(195,198,215,0.35)" : "rgba(60,60,60,0.35)";
  const border = dark ? "rgba(67,70,85,0.15)" : "rgba(200,200,200,0.4)";
  const borderLight = dark ? "rgba(67,70,85,0.1)" : "rgba(200,200,200,0.25)";
  const accent = "#b4c5ff";
  const chartTick = dark ? "rgba(195,198,215,0.4)" : "rgba(60,60,60,0.4)";
  const tooltipBg = dark ? "#0e0e0e" : "#ffffff";

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-6 sm:pl-7">
        <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase leading-none" style={{ fontFamily: "'Epilogue', sans-serif", color: text }}>
          Venue Intel
        </h1>
        <span className="text-[11px] tracking-[3px] uppercase mt-2 block" style={{ fontFamily: "'Space Grotesk', sans-serif", color: subLight }}>
          Pitch Analysis // Weather Data // Historical Patterns
        </span>
      </div>

      {/* Venue Selector */}
      <div className="flex flex-wrap gap-2">
        {venues.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVenue(v)}
            className="px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase transition-all"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: v.id === selectedVenue.id ? "#2563eb" : cardBg,
              color: v.id === selectedVenue.id ? "#fff" : sub,
              border: `1px solid ${v.id === selectedVenue.id ? "#2563eb" : border}`,
            }}
          >
            {v.city}
          </button>
        ))}
      </div>

      {/* Stadium Image + Venue Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tactical Stadium Map */}
        <div className="lg:col-span-8 relative overflow-hidden border" style={{ background: cardBg, borderColor: border, minHeight: 280 }}>
          <div className="absolute inset-0" style={{ background: dark ? "linear-gradient(135deg, #0e1a2e 0%, #0e0e0e 50%, #0e1a2e 100%)" : "linear-gradient(135deg, #e8edf5 0%, #f5f5f5 50%, #e8edf5 100%)" }} />
          {/* Stadium oval SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
            <ellipse cx="200" cy="140" rx="160" ry="110" fill="none" stroke={dark ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.2)"} strokeWidth="2" strokeDasharray="6 4" />
            <ellipse cx="200" cy="140" rx="120" ry="80" fill="none" stroke={dark ? "rgba(180,197,255,0.2)" : "rgba(37,99,235,0.15)"} strokeWidth="1" />
            <rect x="185" y="100" width="30" height="80" fill="none" stroke={dark ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.3)"} strokeWidth="1.5" rx="2" />
            <line x1="200" y1="100" x2="200" y2="180" stroke={dark ? "rgba(34,197,94,0.3)" : "rgba(34,197,94,0.2)"} strokeWidth="0.5" />
            {/* Fielding positions */}
            {[[200,50],[120,75],[280,75],[80,140],[320,140],[130,210],[270,210],[200,230],[160,120],[240,120],[200,140]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill={i < 5 ? "#2563eb" : "#b4c5ff"} opacity={0.6} />
            ))}
            {/* Wind direction arrow */}
            <g transform="translate(350, 40)">
              <text x="0" y="-8" textAnchor="middle" fill={sub} fontSize="7" fontFamily="Space Grotesk">WIND</text>
              <line x1="0" y1="0" x2="-15" y2="15" stroke="#5ac8fa" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
              <defs><marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#5ac8fa" /></marker></defs>
              <text x="-8" y="28" textAnchor="middle" fill="#5ac8fa" fontSize="7" fontFamily="Space Grotesk">{weatherData.windSpeed}km/h</text>
            </g>
          </svg>
          {/* Overlay info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between" style={{ background: dark ? "linear-gradient(to top, rgba(14,14,14,0.95), transparent)" : "linear-gradient(to top, rgba(245,245,245,0.95), transparent)" }}>
            <div className="flex items-center gap-3">
              <Map size={14} style={{ color: accent }} />
              <span className="text-[10px] tracking-[2px] uppercase font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>{selectedVenue.name}</span>
            </div>
            <div className="flex items-center gap-4 text-[9px] tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>
              <span>ALT: {selectedVenue.altitude}</span>
              <span>EST: {selectedVenue.established}</span>
            </div>
          </div>
        </div>

        {/* Side Stats */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Venue Quick Stats */}
          <div className="border p-5 relative overflow-hidden" style={{ background: cardBg, borderColor: border }}>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #2563eb 1px, transparent 1px), radial-gradient(circle at 80% 50%, #b4c5ff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} style={{ color: accent }} />
                <span className="text-[10px] tracking-[2px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>{selectedVenue.city}, India</span>
              </div>
              <h2 className="text-[20px] sm:text-[24px] font-black tracking-[-1px] uppercase mb-1" style={{ fontFamily: "'Epilogue',sans-serif", color: text }}>{selectedVenue.name}</h2>
              <span className="text-[10px] block mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", color: subLight }}>Capacity: {selectedVenue.capacity}</span>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-[20px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: accent }}>{selectedVenue.avgScore}</p>
                  <p className="text-[8px] tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: subLight }}>Avg Score</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{selectedVenue.paceFriendly}%</p>
                  <p className="text-[8px] tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: subLight }}>Pace</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: accent }}>{selectedVenue.spinFriendly}%</p>
                  <p className="text-[8px] tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: subLight }}>Spin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Extra venue details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Star, label: "History Rank", value: `#${selectedVenue.historyRank}`, color: "#f59e0b" },
              { icon: Gauge, label: "Atm. Pressure", value: `${selectedVenue.atmosphericPressure} hPa`, color: "#8b5cf6" },
              { icon: Sun, label: "UV Index", value: String(selectedVenue.uvIndex), color: "#f97316" },
              { icon: Shield, label: "Clay Content", value: `${selectedVenue.clayContent}%`, color: "#d97706" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-3 border" style={{ background: deepBg, borderColor: borderLight }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={11} style={{ color: item.color }} />
                    <span className="text-[8px] tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: subLight }}>{item.label}</span>
                  </div>
                  <p className="text-[16px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: item.color }}>{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pitch Analysis */}
        <div className="lg:col-span-2 border p-5" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center gap-2 mb-5">
            <Eye size={14} className="text-[#2563eb]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>Pitch Analysis</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Droplets, label: "Soil Moisture", value: `${pitchData.soilMoisture}%`, color: "#2563eb" },
              { icon: Activity, label: "Grass Coverage", value: `${pitchData.grassCoverage}%`, color: "#34c759" },
              { icon: TrendingUp, label: "Surface Hardness", value: `${pitchData.surfaceHardness}%`, color: accent },
              { icon: BarChart2, label: "Crack Index", value: String(pitchData.crackIndex), color: "#ff9f0a" },
              { icon: Droplets, label: "Dew Factor", value: `${pitchData.dewFactor}%`, color: "#5ac8fa" },
              { icon: TrendingUp, label: "Bounce Coeff", value: String(pitchData.bounceCoeff), color: text },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="border p-4" style={{ background: deepBg, borderColor: borderLight }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={12} style={{ color: item.color }} />
                    <span className="text-[9px] tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: subLight }}>{item.label}</span>
                  </div>
                  <p className="text-[20px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: item.color }}>{item.value}</p>
                  <div className="mt-2 h-1.5 overflow-hidden" style={{ background: dark ? "rgba(67,70,85,0.2)" : "rgba(200,200,200,0.4)" }}>
                    <div className="h-full transition-all" style={{ width: `${parseFloat(item.value)}%`, backgroundColor: item.color, maxWidth: "100%" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather */}
        <div className="border p-5" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center gap-2 mb-5">
            <Cloud size={14} className="text-[#5ac8fa]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>Weather Data</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Sun size={30} className="text-[#ff9f0a]" />
              <div>
                <p className="text-[28px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>{weatherData.temperature}°C</p>
                <p className="text-[10px]" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>{weatherData.condition}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: Droplets, label: "Humidity", value: `${weatherData.humidity}%` },
                { icon: Wind, label: "Wind", value: `${weatherData.windSpeed} km/h ${weatherData.windDirection}` },
                { icon: Cloud, label: "Rain Chance", value: `${weatherData.rainChance}%` },
                { icon: Gauge, label: "Pressure", value: `${selectedVenue.atmosphericPressure} hPa` },
                { icon: Compass, label: "Wind Dir", value: weatherData.windDirection },
              ].map((w) => {
                const Icon = w.icon;
                return (
                  <div key={w.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: borderLight }}>
                    <div className="flex items-center gap-2">
                      <Icon size={12} style={{ color: subLight }} />
                      <span className="text-[10px] tracking-[1px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>{w.label}</span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>{w.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bounce Coefficient Chart */}
        <div className="border p-5" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: accent }} />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>Bounce Coefficient by Over</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={bounceData}>
              <defs>
                <linearGradient id="bounceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b4c5ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#b4c5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(67,70,85,0.12)" : "rgba(200,200,200,0.3)"} />
              <XAxis dataKey="over" tick={{ fill: chartTick, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartTick, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${border}`, borderRadius: 0, fontSize: 10, color: text }} />
              <Area type="monotone" dataKey="bounce" stroke="#b4c5ff" fill="url(#bounceGrad)" strokeWidth={2} dot={false} name="Bounce" />
              <Area type="monotone" dataKey="seam" stroke="#2563eb" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Seam Movement" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Scores */}
        <div className="border p-5" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-[#2563eb]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>Historical Scores</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={historicalScores} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(67,70,85,0.12)" : "rgba(200,200,200,0.3)"} vertical={false} />
              <XAxis dataKey="match" tick={{ fill: chartTick, fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartTick, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${border}`, borderRadius: 0, fontSize: 10, color: text }} />
              <Bar dataKey="firstInnings" fill="#2563eb" radius={[2, 2, 0, 0]} name="1st Innings" />
              <Bar dataKey="secondInnings" fill="#b4c5ff" radius={[2, 2, 0, 0]} name="2nd Innings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dew Probability Strip */}
      <div className="border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ background: cardBg, borderColor: border }}>
        <div className="flex items-center gap-3">
          <Waves size={16} className="text-[#5ac8fa]" />
          <div>
            <span className="text-[10px] tracking-[2px] uppercase font-bold block" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>DEW_PROBABILITY</span>
            <span className="text-[9px]" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>Post-sunset moisture accumulation forecast</span>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:w-48 h-3 overflow-hidden rounded-full" style={{ background: dark ? "rgba(67,70,85,0.3)" : "rgba(200,200,200,0.4)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${selectedVenue.dewProbability}%`, background: "linear-gradient(90deg, #5ac8fa, #2563eb)" }} />
          </div>
          <span className="text-lg font-black text-[#5ac8fa] shrink-0" style={{ fontFamily: "'Epilogue',sans-serif" }}>{selectedVenue.dewProbability}%</span>
        </div>
      </div>

      {/* Venue Matches */}
      {venueMatches.length > 0 && (
        <div className="border p-5" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: accent }} />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>Matches at this Venue</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {venueMatches.map((m) => (
              <div key={m.id} className="border p-4" style={{ background: deepBg, borderColor: borderLight }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-bold uppercase" style={{ fontFamily: "'Epilogue',sans-serif", color: text }}>{m.team1Code} vs {m.team2Code}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 uppercase" style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    background: m.status === "LIVE" ? "#2563eb" : (dark ? "rgba(67,70,85,0.3)" : "rgba(200,200,200,0.5)"),
                    color: m.status === "LIVE" ? "#fff" : sub,
                  }}>{m.status}</span>
                </div>
                <p className="text-[11px]" style={{ fontFamily: "'Inter',sans-serif", color: sub }}>{m.result || m.aiPrediction}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
