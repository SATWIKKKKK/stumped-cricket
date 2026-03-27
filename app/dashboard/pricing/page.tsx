"use client";

import { useState } from "react";
import { Check, X, Terminal, Zap, Shield, Radar } from "lucide-react";

type Tier = {
  id: string;
  name: string;
  badge: string;
  badgeColor: "default" | "primary" | "premium";
  price: string;
  period: string;
  description: string;
  features: { label: string; included: boolean }[];
  buttonLabel: string;
  buttonStyle: "outline" | "primary" | "inverted";
  recommended?: boolean;
};

const tiers: Tier[] = [
  {
    id: "rookie",
    name: "ROOKIE",
    badge: "ENTRY LEVEL",
    badgeColor: "default",
    price: "$0",
    period: "/ LIFETIME",
    description: "Basic access to historical signal patterns and limited terminal readouts.",
    features: [
      { label: "ACCESS DRS SIM F14", included: false },
      { label: "BASIC DATA STREAM", included: true },
      { label: "AI COMMENTARY F4", included: false },
      { label: "STANDARD TERMINAL", included: true },
    ],
    buttonLabel: "INITIATE SESSION",
    buttonStyle: "outline",
  },
  {
    id: "pro",
    name: "PRO",
    badge: "DATA FOCUSED",
    badgeColor: "primary",
    price: "$29",
    period: "/ MONTH",
    description: "Advanced analytical tools for high-stakes decision cycles and signal processing.",
    features: [
      { label: "ACCESS DRS SIM F14", included: true },
      { label: "FULL DATA SYNC", included: true },
      { label: "AI COMMENTARY F4", included: true },
      { label: "STRATEGY ADVISOR F7", included: false },
    ],
    buttonLabel: "UPGRADE LINK",
    buttonStyle: "primary",
    recommended: true,
  },
  {
    id: "elite",
    name: "ELITE",
    badge: "FULL SPECTRUM",
    badgeColor: "premium",
    price: "$99",
    period: "/ MONTH",
    description: "Maximum tactical advantage. Every simulation module and predictive engine active.",
    features: [
      { label: "FULL AI DRS SIMULATOR", included: true },
      { label: "STRATEGY ADVISOR F7", included: true },
      { label: "PRIORITY SIGNAL BAND", included: true },
      { label: "24/7 ENCRYPTED OPS", included: true },
    ],
    buttonLabel: "DEPLOY ELITE OPS",
    buttonStyle: "inverted",
  },
];

const faqs = [
  {
    id: "QUERY 01",
    question: "HOW SECURE IS THE SIGNAL BREACH DATA?",
    answer: "ALL DATA STREAMS ARE ENCRYPTED USING THE SIGNAL BREACH PROTOCOLS V4.2. WE DO NOT STORE RAW INTELLIGENCE BEYOND THE SESSION LIFECYCLE UNLESS SPECIFIED IN VAULT STORAGE.",
  },
  {
    id: "QUERY 02",
    question: "CAN I DOWNGRADE MY ACCESS TIER?",
    answer: "ACCESS DOWNGRADES ARE PROCESSED AT THE END OF THE CURRENT BILLING CYCLE. NO DATA LOSS WILL OCCUR FOR VAULT-STASHED ASSETS.",
  },
  {
    id: "QUERY 03",
    question: "WHAT IS THE DRS SIMULATOR (F14)?",
    answer: "THE DATA-RECOVERY-SYSTEM SIMULATOR IS A HIGH-FIDELITY ENVIRONMENT FOR TESTING AI RECOVERY STRATEGIES IN CORRUPTED SIGNAL ENVIRONMENTS. MANDATORY FOR ELITE FIELD OPS.",
  },
];

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-[1200px] mx-auto">
      {/* Title Section */}
      <div className="border-l-4 border-[#2563eb] pl-6">
        <p className="text-[10px] text-[#2563eb] tracking-[3px] mb-2 uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          ENCRYPTED ACCESS PORTAL
        </p>
        <h1
          className="text-[40px] sm:text-[64px] lg:text-[80px] font-black tracking-[-4px] uppercase text-[#e2e2e2] leading-[0.9]"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          INTEL TIERS
          <br />
          AND ACCESS
        </h1>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-[rgba(67,70,85,0.3)]">
        {tiers.map((tier, i) => {
          const bgColor = i === 0 ? "bg-[#0e0e0e]" : i === 1 ? "bg-[#1b1b1b]" : "bg-[#1f1f1f]";
          return (
            <div
              key={tier.id}
              className={`${bgColor} p-8 flex flex-col ${
                i < 2 ? "border-b-4 md:border-b-0 md:border-r-4 border-[rgba(67,70,85,0.3)]" : ""
              } relative`}
            >
              {tier.recommended && (
                <div
                  className="absolute top-0 right-0 bg-[#2563eb] text-white px-4 py-1 text-[10px] font-bold tracking-[2px]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  RECOM TIER
                </div>
              )}

              <div className="mb-8">
                <span
                  className={`text-[10px] px-2 py-0.5 font-bold uppercase ${
                    tier.badgeColor === "primary"
                      ? "bg-[#2563eb] text-white"
                      : tier.badgeColor === "premium"
                      ? "bg-[#dbe1ff] text-[#002a78]"
                      : "bg-[#e2e2e2] text-[#131313]"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {tier.badge}
                </span>
                <h2
                  className={`text-3xl font-black mt-4 uppercase ${
                    tier.badgeColor === "primary" ? "text-[#2563eb]" : "text-[#e2e2e2]"
                  }`}
                  style={{ fontFamily: "'Epilogue', sans-serif" }}
                >
                  {tier.name}
                </h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {tier.price}
                  </span>
                  <span className="text-xs opacity-50 text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {tier.period}
                  </span>
                </div>
              </div>

              <div className="flex-grow space-y-6">
                <p className="text-xs opacity-60 leading-relaxed uppercase tracking-[1px] text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {tier.description}
                </p>
                <ul className="space-y-4 text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {tier.features.map((f) => (
                    <li
                      key={f.label}
                      className={`flex items-center gap-3 ${!f.included ? "opacity-40 italic line-through" : ""} text-[#e2e2e2]`}
                    >
                      {f.included ? (
                        <Check size={14} className="text-[#b4c5ff] shrink-0" />
                      ) : (
                        <X size={14} className="shrink-0" />
                      )}
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedTier(tier.id)}
                className={`mt-12 w-full py-4 font-bold uppercase transition-all active:translate-y-1 ${
                  tier.buttonStyle === "primary"
                    ? "bg-[#2563eb] text-white hover:bg-white hover:text-[#2563eb]"
                    : tier.buttonStyle === "inverted"
                    ? "bg-white text-[#131313] hover:bg-[#2563eb] hover:text-white"
                    : "bg-transparent border-2 border-[#e2e2e2] text-[#e2e2e2] hover:bg-[#e2e2e2] hover:text-[#131313]"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {tier.buttonLabel}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <div className="flex items-center gap-4 mb-8">
          <Terminal size={20} className="text-[#2563eb]" />
          <h3 className="text-2xl font-black uppercase tracking-[-1px] text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            TERMINAL READOUT FAQ
          </h3>
        </div>

        <div className="bg-[#0e0e0e] border-2 border-[rgba(67,70,85,0.3)] p-6 sm:p-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <div className="space-y-10">
            {faqs.map((faq, i) => (
              <div
                key={faq.id}
                className={`grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start ${
                  i > 0 ? "border-t border-[rgba(67,70,85,0.3)] pt-10" : ""
                }`}
              >
                <span className="text-[#2563eb] font-bold text-xs opacity-50">[{faq.id}]</span>
                <div>
                  <p className="text-[#e2e2e2] font-bold uppercase text-sm mb-2">{faq.question}</p>
                  <p className="text-[rgba(226,226,226,0.5)] text-xs leading-relaxed max-w-2xl">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-[#2563eb] p-8 sm:p-12 relative overflow-hidden ticket-cut">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <span className="text-[10rem] font-black rotate-12 text-white" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            STUMPED
          </span>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-3xl font-black text-white uppercase tracking-[-2px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              JOIN THE BREACH
            </h4>
            <p className="text-white/80 text-xs uppercase tracking-[2px] mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SECURE YOUR INTEL SLOT BEFORE THE NEXT SIGNAL WAVE.
            </p>
          </div>
          <button
            className="bg-white text-[#131313] px-10 py-4 font-bold uppercase hover:bg-[#131313] hover:text-white transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ESTABLISH UPLINK
          </button>
        </div>
      </div>
    </div>
  );
}
