"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Zap, ArrowRight, CheckCircle, Users, Bolt,
  Activity, Shield, BarChart2, Globe, Star, Crosshair, Brain, Target, Gauge,
} from "lucide-react";

/* ---- clip-path styles ---- */
const ticketClip = "polygon(0% 5%, 5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%)";
const triangleClip = "polygon(50% 0%, 0% 100%, 100% 100%)";
const houseClip = "polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)";

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

const features = [
  {
    icon: Shield,
    title: "DRS Simulator",
    desc: "Simulate Decision Review System outcomes with ball tracking physics — drag, seam, Magnus effect and pitch behavior modeled in real-time.",
    link: "/dashboard/drs",
  },
  {
    icon: Crosshair,
    title: "Ball Trajectory Engine",
    desc: "Full 3D trajectory visualization with spin rate, bounce angle, and deviation prediction using proprietary physics models.",
    link: "/dashboard/trajectory",
  },
  {
    icon: Activity,
    title: "Bowling Load Tracker",
    desc: "Monitor workload, fatigue zones, and injury risk for bowlers across formats with biomechanical analysis.",
    link: "/dashboard/bowling-load",
  },
  {
    icon: Target,
    title: "Field Placement Ops",
    desc: "AI-generated optimal fielding positions based on batter tendencies, pitch conditions, and match situation.",
    link: "/dashboard/field-ops",
  },
  {
    icon: Brain,
    title: "AI Match Narratives",
    desc: "Auto-generated post-match intelligence reports with key moments, momentum shifts, and classified player ratings.",
    link: "/dashboard/narrative",
  },
  {
    icon: BarChart2,
    title: "Head-to-Head Intel",
    desc: "Deep statistical breakdowns of batter vs bowler matchups across formats, venues, and conditions.",
    link: "/dashboard/head-to-head",
  },
  {
    icon: Globe,
    title: "Venue Intel & Weather",
    desc: "Stadium tactical maps, pitch analysis, atmospheric pressure, dew probability, and historical scoring patterns.",
    link: "/dashboard/alerts",
  },
  {
    icon: Gauge,
    title: "Player Radar & Analytics",
    desc: "Multi-dimensional performance radar charts, trend analysis, and predictive form modeling for every player.",
    link: "/dashboard/radar",
  },
];

const whyReasons = [
  { title: "50+ Dashboard Modules", desc: "From live match tracking to fantasy recommendations — every angle of cricket covered under one roof." },
  { title: "Physics-Based Simulation", desc: "No other platform simulates ball trajectories with real aerodynamics. Drag, Magnus, seam — all computed." },
  { title: "Real-Time Intelligence", desc: "Sub-200ms latency on live match data. Get tactical suggestions before the bowler finishes their run-up." },
  { title: "AI-Powered Everything", desc: "Neural networks trained on decades of cricket data power our predictions, narratives, and strategic recommendations." },
];

export default function LandingContent() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect signed-in users straight to dashboard
  useEffect(() => {
    if (session?.user?.id) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const authHref = (path: string) => (session?.user?.id ? path : "/auth/sign-up");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e2e2e2] overflow-x-hidden" style={{ backgroundSize: "40px 40px", backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 px-6 py-4 flex justify-between items-center bg-[#0a0a0a]/95">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tighter uppercase" style={{ fontFamily: "'Epilogue', sans-serif" }}>Stumped AI</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/sign-in" className="text-sm font-bold uppercase border border-white/20 px-5 py-2.5 hover:bg-white hover:text-black transition-all hover:scale-105 transform">
            Login
          </Link>
          <Link href="/auth/sign-up" className="text-sm font-bold uppercase border border-[#2563eb] bg-[#2563eb] text-white px-5 py-2.5 hover:bg-white hover:text-black hover:border-white transition-all hover:scale-105 transform">
            Sign Up
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
          <div className="inline-flex items-center gap-2 mb-6 animate-[fadeIn_0.6s_ease-out_both]">
            <div className="w-3 h-3 rounded-full bg-[#2563eb] animate-[glitter_3s_ease-in-out_infinite]" />
            <span className="text-sm sm:text-base font-bold tracking-[2px] uppercase text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AI-Powered Cricket Intelligence Platform
            </span>
          </div>
          <h2 className="text-[40px] sm:text-[56px] lg:text-[96px] font-black tracking-[-4px] uppercase leading-[0.9] mb-6 animate-[fadeInUp_0.7s_ease-out_0.1s_both]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            Cricket <br />
            <span className="text-[#2563eb]">Reimagined</span>
          </h2>
          <p className="text-base sm:text-xl max-w-2xl mx-auto leading-relaxed text-[rgba(195,198,215,0.6)] mb-10 animate-[fadeInUp_0.7s_ease-out_0.2s_both]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Industrial-grade analytics, real-time match intelligence, and biomechanical simulations &mdash; all powered by advanced AI systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.7s_ease-out_0.3s_both]">
            <Link
              href={authHref("/dashboard")}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#2563eb] text-white text-[11px] font-bold tracking-[1.5px] uppercase hover:bg-[#1d4ed8] transition-all hover:scale-105 transform"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Go to Dashboard <ArrowRight size={14} />
            </Link>
            <Link
              href={authHref("/dashboard/pricing")}
              className="flex items-center gap-2 px-8 py-3.5 border border-[rgba(67,70,85,0.4)] text-[11px] font-bold tracking-[1.5px] uppercase hover:border-white hover:bg-white hover:text-black transition-all hover:scale-105 transform"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Upgrade to Premium <Zap size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== INDIA SPOKE. HERE'S HOW. ========== */}
      <section className="bg-[#e5e5e5] py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
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

          <div className="flex flex-wrap justify-center items-end gap-8 md:gap-12 relative pb-20">
            {/* Triangle */}
            <div
              className="w-[320px] sm:w-[400px] h-[320px] sm:h-[400px] p-6 pt-24 sm:pt-28 flex flex-col items-center justify-end text-center -rotate-[5deg] hover:rotate-0 transition-transform cursor-pointer"
              style={{ clipPath: triangleClip, background: "#262626" }}
            >
              <p className="text-base sm:text-lg md:text-xl font-black uppercase text-white leading-tight px-2" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                70%+ Tactical<br />Blindspots Have<br />No Clear Data-Driven<br />Protocol Today.
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

      {/* ========== INDIA SPOKE. WE LISTENED. ========== */}
      <section className="bg-[#121212] py-24 px-6 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              India Spoke.<br /><span className="text-[#2563eb]">We Listened.</span>
            </h2>
            <p className="text-white/60 max-w-md font-medium text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              The most critical Tactical Blindspots in modern cricket strategy, solved by neural networks trained on every ball ever bowled.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {problemCards.map((c) => (
              <div
                key={c.ref}
                className={`p-8 flex flex-col justify-between ${c.rotate} hover:rotate-0 transition-transform`}
                style={{ clipPath: ticketClip, background: c.bg, color: c.textColor, aspectRatio: "3/4" }}
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

      {/* ========== FEATURES WE OFFER ========== */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#2563eb] block mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              CAPABILITIES
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-[-2px] uppercase" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              Features We <span className="text-[#2563eb]">Offer</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link key={f.title} href={authHref(f.link)}
                  className="p-6 border border-[rgba(67,70,85,0.15)] bg-[#0e0e0e] hover:border-[rgba(37,99,235,0.4)] transition-all hover:scale-[1.03] transform group block"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[rgba(37,99,235,0.1)] mb-5 group-hover:bg-[rgba(37,99,235,0.2)] transition-colors">
                    <Icon size={20} className="text-[#2563eb]" />
                  </div>
                  <h4 className="text-[13px] font-black tracking-[-0.5px] uppercase mb-2" style={{ fontFamily: "'Epilogue', sans-serif" }}>{f.title}</h4>
                  <p className="text-[11px] leading-relaxed text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Inter', sans-serif" }}>{f.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== WHY STUMPED AI ========== */}
      <section className="py-24 px-6 border-t border-white/10 bg-[#0e0e0e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#2563eb] block mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              THE EDGE
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-[-2px] uppercase" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              Why <span className="text-[#2563eb]">Stumped AI</span>?
            </h3>
            <p className="text-white/40 max-w-lg mx-auto mt-4 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Built by cricket obsessives. Powered by cutting-edge AI. Designed for coaches, analysts, and fans who refuse to settle for surface-level stats.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyReasons.map((r, i) => (
              <div key={r.title} className="border-l-4 pl-6 py-4" style={{ borderColor: i === 0 ? "#2563eb" : "rgba(255,255,255,0.1)" }}>
                <h4 className="text-sm font-black uppercase tracking-widest mb-2" style={{ fontFamily: "'Epilogue', sans-serif", color: i === 0 ? "#2563eb" : "white" }}>{r.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href={authHref("/dashboard")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2563eb] text-white text-[11px] font-bold tracking-[1.5px] uppercase hover:bg-[#1d4ed8] transition-all hover:scale-105 transform"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Start Exploring <ArrowRight size={14} />
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
                <li><Link href={authHref("/dashboard")} className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href={authHref("/dashboard/logs")} className="hover:text-white transition-colors">API Docs</Link></li>
                <li><Link href={authHref("/dashboard/archive")} className="hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link href={authHref("/dashboard/pricing")} className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[#2563eb] font-bold text-xs uppercase tracking-widest mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Company</h5>
              <ul className="space-y-4 text-xs font-bold uppercase text-white/60">
                <li><Link href={authHref("/dashboard/about")} className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href={authHref("/dashboard/mission")} className="hover:text-white transition-colors">Mission</Link></li>
                <li><Link href={authHref("/dashboard/careers")} className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[#2563eb] font-bold text-xs uppercase tracking-widest mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Legal</h5>
              <ul className="space-y-4 text-xs font-bold uppercase text-white/60">
                <li><Link href={authHref("/dashboard/privacy")} className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href={authHref("/dashboard/terms")} className="hover:text-white transition-colors">Terms</Link></li>
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
