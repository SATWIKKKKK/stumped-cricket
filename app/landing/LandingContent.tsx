"use client";

import Link from "next/link";
import { Activity, Zap, Shield, BarChart2, Globe, Radio, Star, ArrowRight, ChevronRight, CheckCircle, Users, Bolt, Key } from "lucide-react";

/* ---- clip-path styles ---- */
const ticketClip = "polygon(0% 5%, 5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%)";
const triangleClip = "polygon(50% 0%, 0% 100%, 100% 100%)";
const houseClip = "polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)";

const heroStats = [
  { label: "System Status", value: "ONLINE // STABLE", highlight: true },
  { label: "Data Points", value: "1.2B+ ANALYZED", highlight: false },
  { label: "Tactical Efficiency", value: "98.4% SCORE", highlight: false },
  { label: "Active Analysts", value: "42,000+ USERS", highlight: false },
];

const problemCards = [
  {
    ref: "REF_TKT_001",
    title: "Why is player form so unpredictable?",
    desc: "Our AI tracks fatigue, biomechanical shifts, and psychological triggers to predict performance dips 3 games in advance.",
    footer: "Confidence: 92%",
    bg: "#1a1a1a",
    textColor: "white",
    rotate: "-rotate-2",
    badge: true,
  },
  {
    ref: "REF_TKT_002",
    title: "How do I optimize field placement?",
    desc: "Dynamic heatmaps for left-arm pacers against aggressive right-handers. Eliminate the gaps before they're exploited.",
    footer: "Tactical Edge: High",
    bg: "#2563eb",
    textColor: "white",
    rotate: "rotate-3",
    badge: false,
    alert: true,
  },
  {
    ref: "REF_TKT_003",
    title: "When should I deploy my spinner?",
    desc: "Pitch degradation analysis + batter weakness cross-referencing. The exact over, calculated in real-time.",
    footer: "Impact: Critical",
    bg: "#1a1a1a",
    textColor: "white",
    rotate: "-rotate-1",
    badge: false,
  },
  {
    ref: "REF_TKT_004",
    title: "What is the win probability?",
    desc: "Simulated over 10,000 parallel game-states. Know the outcome before the final ball is bowled.",
    footer: "Precision: Extreme",
    bg: "white",
    textColor: "black",
    rotate: "rotate-2",
    badge: false,
    inverted: true,
  },
];

export default function LandingContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e2e2e2] overflow-x-hidden" style={{ backgroundSize: "40px 40px", backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)" }}>
      {/* Grain */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 px-6 py-4 flex justify-between items-center" style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563eb] rounded-sm rotate-45 flex items-center justify-center">
            <span className="text-white font-bold -rotate-45 text-sm">S</span>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase" style={{ fontFamily: "'Epilogue', sans-serif" }}>Stumped AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase">
          <Link href="/dashboard" className="hover:text-[#2563eb] transition-colors">Tactics</Link>
          <Link href="/dashboard/analytics" className="hover:text-[#2563eb] transition-colors">Insights</Link>
          <Link href="/dashboard/drs" className="hover:text-[#2563eb] transition-colors">The Lab</Link>
          <Link href="/dashboard/network" className="hover:text-[#2563eb] transition-colors">Contact</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/sign-in" className="text-xs font-bold uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563eb, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #b4c5ff, transparent 70%)" }} />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-block px-4 py-1.5 mb-6 border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.08)]">
            <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AI-Powered Cricket Intelligence Platform
            </span>
          </div>
          <h2 className="text-[40px] sm:text-[56px] lg:text-[72px] font-black tracking-[-4px] uppercase leading-[0.9] mb-6" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            Cricket <br />
            <span className="text-[#2563eb]">Reimagined</span>
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-[rgba(195,198,215,0.6)] mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            Industrial-grade analytics, real-time match intelligence, and biomechanical simulations — all powered by advanced AI systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-3.5 bg-[#2563eb] text-white text-[11px] font-bold tracking-[1.5px] uppercase hover:bg-[#1d4ed8] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Go to Dashboard <ArrowRight size={14} />
            </Link>
            <Link
              href="/dashboard/pricing"
              className="flex items-center gap-2 px-8 py-3.5 border border-[rgba(67,70,85,0.4)] text-[11px] font-bold tracking-[1.5px] uppercase hover:border-[#2563eb] hover:text-[#2563eb] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Upgrade to Premium <Zap size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-[rgba(67,70,85,0.15)] bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4">
          {heroStats.map((s, i) => (
            <div key={s.label} className={`p-6 sm:p-8 text-center ${i < heroStats.length - 1 ? "border-r border-[rgba(67,70,85,0.15)]" : ""}`}>
              <p className="text-[22px] sm:text-[28px] font-black text-[#2563eb]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{s.value}</p>
              <p className="text-[9px] tracking-[2px] uppercase text-[rgba(195,198,215,0.4)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== INDIA SPOKE. HERE'S HOW. ========== */}
      <section className="bg-[#e5e5e5] py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-black border-b-2 border-black pb-8">
            <div className="flex items-center gap-4">
              <CheckCircle size={28} className="text-black" />
              <span className="text-xs font-bold uppercase tracking-widest text-black">10,000+ Verified Blindspots</span>
            </div>
            <div className="flex items-center gap-4 md:border-x-2 border-black/10 md:px-12">
              <Users size={28} className="text-black" />
              <span className="text-xs font-bold uppercase tracking-widest text-black">From 50K People and Counting</span>
            </div>
            <div className="flex items-center gap-4">
              <Bolt size={28} className="text-black" />
              <span className="text-xs font-bold uppercase tracking-widest text-black">AI-Powered Curation</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-black text-center uppercase tracking-tighter mb-20 leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            India Spoke. Here&apos;s How.
          </h2>

          {/* Chunky card shapes */}
          <div className="flex flex-wrap justify-center items-end gap-8 md:gap-12 relative pb-20">
            {/* Triangle */}
            <div
              className="w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] p-8 sm:p-12 flex flex-col items-center justify-center text-center -rotate-[5deg] hover:rotate-0 transition-transform cursor-pointer"
              style={{ clipPath: triangleClip, background: "#262626" }}
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white leading-tight px-4" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                70%+<br />Tactical<br />Blindspots<br />Have No Clear<br />Data-Driven<br />Protocol<br />Today.
              </p>
            </div>

            {/* Ticket 1 (Blue) */}
            <div className="relative">
              <div className="absolute -top-12 -left-8 text-[#2563eb] text-7xl font-bold animate-pulse select-none">*</div>
              <div
                className="w-[260px] sm:w-[320px] h-[340px] sm:h-[400px] p-8 sm:p-10 flex flex-col justify-center rotate-[3deg] hover:rotate-0 transition-transform"
                style={{ clipPath: ticketClip, background: "#2563eb", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              >
                <p className="text-2xl sm:text-3xl font-black text-white uppercase leading-[0.95]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  Even Strategy,<br />Selection,<br />and Recovery<br />Made the<br />List.
                </p>
              </div>
            </div>

            {/* House shape */}
            <div className="relative">
              <div
                className="w-[300px] sm:w-[380px] h-[280px] sm:h-[350px] p-8 sm:p-12 pt-16 sm:pt-20 flex flex-col items-center justify-center text-center -rotate-[2deg] hover:rotate-0 transition-transform"
                style={{ clipPath: houseClip, background: "#262626" }}
              >
                <p className="text-2xl sm:text-3xl font-black uppercase text-white leading-tight" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  9,500+<br />Strategic Units<br />Feel They Are<br />Missing<br />The Edge.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-[#2563eb]/80 rounded-full flex items-center justify-center rotate-45">
                <Key size={40} className="text-white" />
              </div>
            </div>

            {/* Ticket 2 (Blue, tall) */}
            <div
              className="w-[240px] sm:w-[300px] h-[380px] sm:h-[450px] p-8 sm:p-10 flex flex-col justify-between rotate-[5deg] hover:rotate-0 transition-transform"
              style={{ clipPath: ticketClip, background: "#2563eb", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
            >
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white uppercase leading-[0.95]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  2 out of 3<br />Head Coaches<br />aren&apos;t<br />Finding their<br />Next Win.
                </p>
              </div>
              <div className="border-t border-dotted border-white/40 pt-6">
                <p className="text-[10px] font-bold text-white/80 uppercase" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  *Maybe Stumped AI can find it for them?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== INDIA SPOKE. WE LISTENED. (Problem/Solution Ticket Grid) ========== */}
      <section className="bg-[#121212] py-24 px-6 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                India Spoke.<br /><span className="text-[#2563eb]">We Listened.</span>
              </h2>
              <p className="text-white/60 max-w-md font-medium text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                The most critical Tactical Blindspots in modern cricket strategy, solved by neural networks trained on every ball ever bowled.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="p-4 bg-[#0a0a0a] border border-white/10 relative">
                <div className="absolute top-[-2px] left-[-2px] w-[10px] h-[10px] border-t-2 border-l-2 border-[#2563eb]" />
                <p className="text-[10px] text-[#2563eb] mb-1" style={{ fontFamily: "'Space Grotesk', monospace" }}>METRIC_01</p>
                <p className="text-xl font-black uppercase italic" style={{ fontFamily: "'Epilogue', sans-serif" }}>AI Powered</p>
              </div>
              <div className="p-4 bg-[#0a0a0a] border border-white/10 relative">
                <div className="absolute top-[-2px] left-[-2px] w-[10px] h-[10px] border-t-2 border-l-2 border-[#2563eb]" />
                <p className="text-[10px] text-[#2563eb] mb-1" style={{ fontFamily: "'Space Grotesk', monospace" }}>METRIC_02</p>
                <p className="text-xl font-black uppercase italic" style={{ fontFamily: "'Epilogue', sans-serif" }}>Verified</p>
              </div>
            </div>
          </div>

          {/* Ticket cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {problemCards.map((c) => (
              <div
                key={c.ref}
                className={`p-8 flex flex-col justify-between ${c.rotate} hover:rotate-0 transition-transform`}
                style={{
                  clipPath: ticketClip,
                  background: c.bg,
                  color: c.textColor,
                  aspectRatio: "3/4",
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs tracking-tighter" style={{ fontFamily: "'Space Grotesk', monospace", opacity: 0.3 }}>{c.ref}</span>
                  {c.badge && (
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                      <Star size={14} className="text-[#2563eb]" />
                    </div>
                  )}
                  {c.alert && (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <span className="text-[#2563eb] text-xl font-bold">!</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase leading-none mb-4" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                    {c.title}
                  </h3>
                  <p className={`text-xs leading-relaxed uppercase ${c.inverted ? "font-bold italic" : ""}`} style={{ opacity: c.inverted ? 0.6 : 0.5 }}>
                    {c.desc}
                  </p>
                </div>
                <div className="border-t border-dashed pt-4" style={{ borderColor: c.inverted ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${c.inverted ? "text-[#2563eb]" : c.bg === "#2563eb" ? "text-white" : "text-[#2563eb]"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {c.footer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== THE ULTIMATE TACTICAL VIEW ========== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase mb-8 leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              The Ultimate<br /><span className="text-[#2563eb]">Tactical View</span>
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-[#2563eb] pl-6">
                <h4 className="font-bold uppercase tracking-widest text-[#2563eb] mb-2 text-sm" style={{ fontFamily: "'Epilogue', sans-serif" }}>Neural Net Curation</h4>
                <p className="text-white/50 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Every data point is filtered through our proprietary LLM, specifically trained on tactical cricket history from 1970-2024.
                </p>
              </div>
              <div className="border-l-4 border-white/20 pl-6">
                <h4 className="font-bold uppercase tracking-widest text-white mb-2 text-sm" style={{ fontFamily: "'Epilogue', sans-serif" }}>Verified Blindspots</h4>
                <p className="text-white/50 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  We don&apos;t just solve hypotheticals. Our list is curated from real-world frustration shared by 50k+ pro Strategic Units.
                </p>
              </div>
              <div className="border-l-4 border-white/20 pl-6">
                <h4 className="font-bold uppercase tracking-widest text-white mb-2 text-sm" style={{ fontFamily: "'Epilogue', sans-serif" }}>Real-time Sync</h4>
                <p className="text-white/50 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Latency under 100ms. Get tactical suggestions while the bowler is still at the top of their run-up.
                </p>
              </div>
            </div>
          </div>
          {/* Tactical Display Visual */}
          <div className="relative border border-white/10 p-2 bg-[#0a0a0a]/50">
            <div className="w-full aspect-[4/3] bg-[#0e0e0e] border border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
              {/* Mock dashboard visual */}
              <div className="w-full h-full p-6 relative" style={{ background: "linear-gradient(135deg, #0e0e0e 0%, #1a1a1a 100%)" }}>
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/60" />
                </div>
                <div className="mt-8 space-y-3">
                  <div className="text-xs font-black uppercase tracking-widest text-white/80" style={{ fontFamily: "'Epilogue', sans-serif" }}>ALL PROBLEMS</div>
                  <div className="text-[9px] uppercase tracking-[2px] text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', monospace" }}>SYSTEM_SCAN: ACTIVE</div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="h-8 sm:h-12" style={{ background: i % 3 === 0 ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[40, 65, 30, 80, 55, 45, 70].map((h, i) => (
                      <div key={i} className="flex-1 flex items-end">
                        <div className="w-full" style={{ height: `${h}%`, minHeight: 8, background: i % 2 === 0 ? "#2563eb" : "rgba(255,255,255,0.08)" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Scanning line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#2563eb] opacity-50 animate-bounce" style={{ boxShadow: "0 0 15px #2563EB" }} />
            </div>
            <div className="absolute inset-0 bg-[#2563eb]/5 pointer-events-none" />
            <div className="absolute top-4 right-4 bg-[#0a0a0a] border border-[#2563eb]/50 px-2 py-1">
              <span className="text-[10px] text-[#2563eb] uppercase" style={{ fontFamily: "'Space Grotesk', monospace" }}>SYSTEM_SCAN: ACTIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-[28px] sm:text-[36px] font-black tracking-[-2px] uppercase mb-6" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            Ready to <span className="text-[#2563eb]">Decode</span> the Game?
          </h3>
          <p className="text-white/40 mb-8 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
            Access real-time match intelligence, player analytics, and AI-powered simulations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-3.5 bg-[#2563eb] text-white text-[11px] font-bold tracking-[1.5px] uppercase hover:bg-[#1d4ed8] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Enter Dashboard <ChevronRight size={14} />
            </Link>
            <Link
              href="/dashboard/pricing"
              className="flex items-center gap-2 px-8 py-3.5 border border-white/20 text-[11px] font-bold tracking-[1.5px] uppercase hover:border-[#2563eb] hover:text-[#2563eb] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              View Pricing <Zap size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-[#2563eb] rounded-sm flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">S</span>
              </div>
              <span className="text-lg font-black tracking-tighter uppercase" style={{ fontFamily: "'Epilogue', sans-serif" }}>Stumped AI</span>
            </div>
            <p className="text-xs text-white/40 uppercase font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Building the future of tactical sports intelligence. No more guessing. Just winning.
            </p>
            <div className="flex gap-4">
              {["X", "IN", "IG"].map((s) => (
                <div key={s} className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#2563eb] transition-colors cursor-pointer uppercase text-xs" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h5 className="text-[#2563eb] font-bold text-xs uppercase tracking-widest mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Product</h5>
              <ul className="space-y-4 text-xs font-bold uppercase text-white/60">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard/logs" className="hover:text-white transition-colors">API Docs</Link></li>
                <li><Link href="/dashboard/archive" className="hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link href="/dashboard/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[#2563eb] font-bold text-xs uppercase tracking-widest mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Company</h5>
              <ul className="space-y-4 text-xs font-bold uppercase text-white/60">
                <li><Link href="/dashboard/network" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/dashboard/network" className="hover:text-white transition-colors">Mission</Link></li>
                <li><Link href="/dashboard/network" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[#2563eb] font-bold text-xs uppercase tracking-widest mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Legal</h5>
              <ul className="space-y-4 text-xs font-bold uppercase text-white/60">
                <li><Link href="/dashboard/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/dashboard/privacy" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.5em]" style={{ fontFamily: "'Space Grotesk', monospace" }}>
            &copy; {new Date().getFullYear()} STUMPED AI INTELLIGENCE CORP. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
