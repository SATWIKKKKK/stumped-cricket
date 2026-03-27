"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Map, Droplets, Wind, Thermometer, Cloud, Sun,
  TrendingUp, Activity, BarChart2, Eye,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import type { MatchItem } from "@/lib/server/types";

/* ---------- venue data ---------- */
const venues = [
  { id: "wankhede", name: "Wankhede Stadium", city: "Mumbai", capacity: "33,000", avgScore: 168, paceFriendly: 58, spinFriendly: 42 },
  { id: "chinnaswamy", name: "M Chinnaswamy Stadium", city: "Bengaluru", capacity: "40,000", avgScore: 182, paceFriendly: 45, spinFriendly: 55 },
  { id: "eden", name: "Eden Gardens", city: "Kolkata", capacity: "68,000", avgScore: 158, paceFriendly: 52, spinFriendly: 48 },
  { id: "chepauk", name: "MA Chidambaram Stadium", city: "Chennai", capacity: "50,000", avgScore: 155, paceFriendly: 38, spinFriendly: 62 },
  { id: "narendra", name: "Narendra Modi Stadium", city: "Ahmedabad", capacity: "132,000", avgScore: 162, paceFriendly: 50, spinFriendly: 50 },
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-6 sm:pl-7">
        <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          Venue Intel
        </h1>
        <span className="text-[11px] tracking-[3px] uppercase text-[rgba(226,226,226,0.35)] mt-2 block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Pitch Analysis // Weather Data // Historical Patterns
        </span>
      </div>

      {/* Venue Selector */}
      <div className="flex flex-wrap gap-2">
        {venues.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVenue(v)}
            className={`px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase transition-all ${v.id === selectedVenue.id ? "bg-[#2563eb] text-white" : "bg-[#1b1b1b] text-[rgba(195,198,215,0.4)] hover:text-[#e2e2e2] border border-[rgba(67,70,85,0.2)]"}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {v.city}
          </button>
        ))}
      </div>

      {/* Venue Header Card */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #2563eb 1px, transparent 1px), radial-gradient(circle at 80% 50%, #b4c5ff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Map size={16} className="text-[#b4c5ff]" />
              <span className="text-[10px] tracking-[2px] uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{selectedVenue.city}, India</span>
            </div>
            <h2 className="text-[24px] sm:text-[32px] font-black tracking-[-1px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue',sans-serif" }}>{selectedVenue.name}</h2>
            <span className="text-[10px] text-[rgba(195,198,215,0.35)] mt-1 block" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Capacity: {selectedVenue.capacity}</span>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[24px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{selectedVenue.avgScore}</p>
              <p className="text-[8px] tracking-[1.5px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Avg Score</p>
            </div>
            <div className="w-px bg-[rgba(67,70,85,0.2)]" />
            <div className="text-center">
              <p className="text-[24px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{selectedVenue.paceFriendly}%</p>
              <p className="text-[8px] tracking-[1.5px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Pace</p>
            </div>
            <div className="text-center">
              <p className="text-[24px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{selectedVenue.spinFriendly}%</p>
              <p className="text-[8px] tracking-[1.5px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Spin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pitch Analysis */}
        <div className="lg:col-span-2 bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <Eye size={14} className="text-[#2563eb]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Pitch Analysis</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Droplets, label: "Soil Moisture", value: `${pitchData.soilMoisture}%`, color: "#2563eb" },
              { icon: Activity, label: "Grass Coverage", value: `${pitchData.grassCoverage}%`, color: "#34c759" },
              { icon: TrendingUp, label: "Surface Hardness", value: `${pitchData.surfaceHardness}%`, color: "#b4c5ff" },
              { icon: BarChart2, label: "Crack Index", value: String(pitchData.crackIndex), color: "#ff9f0a" },
              { icon: Droplets, label: "Dew Factor", value: `${pitchData.dewFactor}%`, color: "#5ac8fa" },
              { icon: TrendingUp, label: "Bounce Coeff", value: String(pitchData.bounceCoeff), color: "#e2e2e2" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={12} style={{ color: item.color }} />
                    <span className="text-[9px] tracking-[1.5px] uppercase text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{item.label}</span>
                  </div>
                  <p className="text-[20px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: item.color }}>{item.value}</p>
                  <div className="mt-2 h-1.5 bg-[rgba(67,70,85,0.2)] overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${parseFloat(item.value)}%`, backgroundColor: item.color, maxWidth: "100%" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <Cloud size={14} className="text-[#5ac8fa]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Weather Data</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Sun size={30} className="text-[#ff9f0a]" />
              <div>
                <p className="text-[28px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{weatherData.temperature}°C</p>
                <p className="text-[10px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{weatherData.condition}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: Droplets, label: "Humidity", value: `${weatherData.humidity}%` },
                { icon: Wind, label: "Wind", value: `${weatherData.windSpeed} km/h ${weatherData.windDirection}` },
                { icon: Cloud, label: "Rain Chance", value: `${weatherData.rainChance}%` },
              ].map((w) => {
                const Icon = w.icon;
                return (
                  <div key={w.label} className="flex items-center justify-between py-2 border-b border-[rgba(67,70,85,0.1)]">
                    <div className="flex items-center gap-2">
                      <Icon size={12} className="text-[rgba(195,198,215,0.3)]" />
                      <span className="text-[10px] tracking-[1px] uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{w.label}</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{w.value}</span>
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
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-[#b4c5ff]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Bounce Coefficient by Over</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={bounceData}>
              <defs>
                <linearGradient id="bounceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b4c5ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#b4c5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" />
              <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0, fontSize: 10 }} />
              <Area type="monotone" dataKey="bounce" stroke="#b4c5ff" fill="url(#bounceGrad)" strokeWidth={2} dot={false} name="Bounce" />
              <Area type="monotone" dataKey="seam" stroke="#2563eb" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Seam Movement" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Scores */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-[#2563eb]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Historical Scores</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={historicalScores} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" vertical={false} />
              <XAxis dataKey="match" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0, fontSize: 10 }} />
              <Bar dataKey="firstInnings" fill="#2563eb" radius={[2, 2, 0, 0]} name="1st Innings" />
              <Bar dataKey="secondInnings" fill="#b4c5ff" radius={[2, 2, 0, 0]} name="2nd Innings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Venue Matches */}
      {venueMatches.length > 0 && (
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-[#b4c5ff]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Matches at this Venue</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {venueMatches.map((m) => (
              <div key={m.id} className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-bold text-[#e2e2e2] uppercase" style={{ fontFamily: "'Epilogue',sans-serif" }}>{m.team1Code} vs {m.team2Code}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 uppercase ${m.status === "LIVE" ? "bg-[#2563eb] text-white" : "bg-[rgba(67,70,85,0.3)] text-[rgba(195,198,215,0.5)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{m.status}</span>
                </div>
                <p className="text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Inter',sans-serif" }}>{m.result || m.aiPrediction}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
