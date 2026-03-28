"use client";

import Link from "next/link";
import { Activity, Zap, Shield, BarChart2, Globe, Radio, Star, ArrowRight, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "Live Match Intelligence",
    desc: "Real-time ball-by-ball analysis with AI-powered win probability, momentum shifts, and predictive scoring models.",
  },
  {
    icon: Activity,
    title: "Biomechanical Analysis",
    desc: "Track bowling workloads, fatigue zones, and injury prediction using cutting-edge physics and biomechanics engines.",
  },
  {
    icon: BarChart2,
    title: "Advanced Analytics",
    desc: "Deep statistical exploration with head-to-head records, player radars, trend analysis, and fantasy recommendations.",
  },
  {
    icon: Shield,
    title: "DRS & Ball Tracking",
    desc: "Simulate DRS decisions with our proprietary ball trajectory engine — accounting for drag, Magnus effect, and pitch behavior.",
  },
  {
    icon: Globe,
    title: "Venue Intelligence",
    desc: "Tactical stadium maps, pitch analysis, weather data, dew probability, and historical scoring patterns for every ground.",
  },
  {
    icon: Star,
    title: "AI Match Narratives",
    desc: "Auto-generated post-match reports with key moments, momentum analysis, and player ratings — classified intel grade.",
  },
];

const stats = [
  { value: "50+", label: "Dashboard Pages" },
  { value: "12", label: "Data Models" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 200ms", label: "Response Time" },
];

export default function LandingContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e2e2e2] overflow-x-hidden">
      {/* Grain */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[rgba(67,70,85,0.15)]" style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-[20px] font-black tracking-[-1px] uppercase" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            STUMPED <span className="text-[#2563eb]">AI</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-[10px] font-bold tracking-[1.5px] uppercase px-5 py-2.5 bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Go to Dashboard
            </Link>
          </div>
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
          <h2 className="text-[48px] sm:text-[72px] lg:text-[96px] font-black tracking-[-4px] uppercase leading-[0.9] mb-6" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            Cricket <br />
            <span className="text-[#2563eb]">Reimagined</span>
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-[rgba(195,198,215,0.6)] mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
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
          {stats.map((s, i) => (
            <div key={i} className={`p-6 sm:p-8 text-center ${i < stats.length - 1 ? "border-r border-[rgba(67,70,85,0.15)]" : ""}`}>
              <p className="text-[28px] sm:text-[36px] font-black text-[#2563eb]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{s.value}</p>
              <p className="text-[9px] tracking-[2px] uppercase text-[rgba(195,198,215,0.4)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#2563eb] block mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              CAPABILITIES
            </span>
            <h3 className="text-[36px] sm:text-[48px] font-black tracking-[-2px] uppercase" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              Built for the <span className="text-[#2563eb]">Modern</span> Game
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-8 border border-[rgba(67,70,85,0.15)] bg-[#0e0e0e] hover:border-[rgba(37,99,235,0.3)] transition-colors group">
                  <div className="w-10 h-10 flex items-center justify-center bg-[rgba(37,99,235,0.1)] mb-5 group-hover:bg-[rgba(37,99,235,0.2)] transition-colors">
                    <Icon size={20} className="text-[#2563eb]" />
                  </div>
                  <h4 className="text-[14px] font-black tracking-[-0.5px] uppercase mb-3" style={{ fontFamily: "'Epilogue', sans-serif" }}>{f.title}</h4>
                  <p className="text-[12px] leading-relaxed text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Inter', sans-serif" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[rgba(67,70,85,0.15)]">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-[36px] sm:text-[48px] font-black tracking-[-2px] uppercase mb-6" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            Ready to <span className="text-[#2563eb]">Decode</span> the Game?
          </h3>
          <p className="text-[rgba(195,198,215,0.5)] mb-8 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
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
              className="flex items-center gap-2 px-8 py-3.5 border border-[rgba(67,70,85,0.4)] text-[11px] font-bold tracking-[1.5px] uppercase hover:border-[#2563eb] hover:text-[#2563eb] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              View Pricing <Zap size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(67,70,85,0.15)] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[12px] font-black tracking-[-0.5px] uppercase" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            STUMPED <span className="text-[#2563eb]">AI</span>
          </span>
          <span className="text-[10px] tracking-[1px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            &copy; {new Date().getFullYear()} STUMPED AI // ALL RIGHTS RESERVED
          </span>
        </div>
      </footer>
    </div>
  );
}
