"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  playerId: string;
  role: string;
};

type ToggleProps = { label: string; sub?: string; defaultOn?: boolean };
function Toggle({ label, sub, defaultOn = false }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-4 border-b border-[rgba(67,70,85,0.1)]">
      <div>
        <p className="text-[13px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</p>
        {sub && <p className="text-[10px] text-[rgba(195,198,215,0.4)] mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{sub}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 relative transition-colors ${on ? "bg-[#2563eb]" : "bg-[#353535]"}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      const response = await fetch("/api/profile", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!active) return;
      if (response.ok && payload?.data) {
        setProfile(payload.data);
      }
      setProfileLoading(false);
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[900px]">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2">
        <h1
          className="text-[clamp(32px,5vw,60px)] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          CRICKET SETTINGS
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-[12px] tracking-[3.6px] uppercase text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Team Preferences // ANALYST ID 72
          </span>
        </div>
      </div>

      {/* Profile section */}
      <div className="bg-[#1b1b1b] p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ANALYST PROFILE
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[1px] uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              PLAYER ID
            </label>
            <input
              type="text"
              readOnly
              value={profile?.playerId ?? (profileLoading ? "Loading..." : "Unavailable")}
              className="bg-[#0e0e0e] border-b-2 border-[#353535] px-3 py-3 text-[13px] text-[#e2e2e2] outline-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[1px] uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              DISPLAY NAME
            </label>
            <input
              type="text"
              readOnly
              value={profile?.name ?? (profileLoading ? "Loading..." : "Unavailable")}
              className="bg-[#0e0e0e] border-b-2 border-[#353535] px-3 py-3 text-[13px] text-[#e2e2e2] outline-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[1px] uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              EMAIL
            </label>
            <input
              type="text"
              readOnly
              value={profile?.email ?? (profileLoading ? "Loading..." : "Unavailable")}
              className="bg-[#0e0e0e] border-b-2 border-[#353535] px-3 py-3 text-[13px] text-[#e2e2e2] outline-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[1px] uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ROLE
            </label>
            <input
              type="text"
              readOnly
              value={profile?.role?.toUpperCase() ?? (profileLoading ? "Loading..." : "USER")}
              className="bg-[#0e0e0e] border-b-2 border-[#353535] px-3 py-3 text-[13px] text-[#e2e2e2] outline-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#1b1b1b] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            MATCH ALERTS
          </span>
        </div>
        <Toggle label="LIVE MATCH ALERTS" sub="Push notifications for live match events" defaultOn={true} />
        <Toggle label="WICKET FEED" sub="Instant alert on every wicket" defaultOn={true} />
        <Toggle label="FANTASY REMINDERS" sub="Deadline alerts for fantasy team selection" defaultOn={false} />
        <Toggle label="AI INSIGHTS DIGEST" sub="Daily AI-powered cricket digest" defaultOn={true} />
        <Toggle label="RANKING CHANGES" sub="Notify when tracked players change ranking" defaultOn={false} />
        <Toggle label="SOCIAL PULSE FEED" sub="Trending cricket social media alerts" defaultOn={true} />
      </div>

      {/* AI preferences */}
      <div className="bg-[#1b1b1b] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            CRICKET MODEL SETUP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: "PRIMARY MODEL", options: ["claude-sonnet-4-6", "claude-haiku-4-5", "claude-opus-4-6"], selected: "claude-sonnet-4-6" },
            { label: "PREDICTION DEPTH", options: ["FAST (1k sims)", "STANDARD (10k sims)", "DEEP (100k sims)"], selected: "STANDARD (10k sims)" },
          ].map((sel) => (
            <div key={sel.label} className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[1px] uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {sel.label}
              </label>
              <div className="relative">
                <select
                  defaultValue={sel.selected}
                  className="w-full bg-[#0e0e0e] border-b-2 border-[#353535] focus:border-[#2563eb] px-3 py-3 text-[13px] text-[#e2e2e2] outline-none appearance-none cursor-pointer"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {sel.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#c3c6d7]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Toggle label="AUTO FANTASY OPTIMISE" sub="Let AI auto-generate best Fantasy XI before deadline" defaultOn={true} />
        <Toggle label="PREDICTIVE COMMENTARY" sub="AI-generated ball-by-ball commentary insights" defaultOn={true} />
      </div>

      {/* API config */}
      <div className="bg-[#1b1b1b] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            API KEY MANAGEMENT
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold tracking-[1px] uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ANTHROPIC API KEY
          </label>
          <input
            type="password"
            placeholder="sk-ant-apiâ€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            className="bg-[#0e0e0e] border-b-2 border-[#353535] focus:border-[#2563eb] px-3 py-3 text-[13px] text-[#e2e2e2] outline-none transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          />
          <p className="text-[9px] text-[rgba(195,198,215,0.4)] tracking-[0.8px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Required for AI commentary, predictions, and fantasy optimization. Get yours at console.anthropic.com
          </p>
        </div>

        {/* API usage meter */}
        <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CREDITS USAGE</span>
            <span className="text-[10px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>$1.23 / $5.00</span>
          </div>
          <div className="h-2 bg-[#353535] overflow-hidden">
            <div className="h-full bg-[#2563eb]" style={{ width: "24.6%" }} />
          </div>
          <p className="text-[9px] text-[rgba(195,198,215,0.4)] mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            24.6% used this month Â· ~2,400 AI calls remaining
          </p>
        </div>
      </div>

      {/* Data & privacy */}
      <div className="bg-[#1b1b1b] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            DATA PRIVACY
          </span>
        </div>
        <Toggle label="LIVE FEED PROTECTION" sub="Keep your match feed data secure across devices" defaultOn={true} />
        <Toggle label="ANALYTICS TRACKING" sub="Share anonymous usage analytics to improve platform" defaultOn={false} />
        <Toggle label="SESSION PERSISTENCE" sub="Remember login across browser sessions" defaultOn={true} />
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] px-8 py-4 flex items-center gap-3 transition-colors"
        >
          {saved && <Check size={14} className="text-white" />}
          <span
            className="text-[14px] font-black tracking-[-0.7px] uppercase text-white"
            style={{ fontFamily: "'Epilogue', sans-serif" }}
          >
            {saved ? "SAVED SUCCESSFULLY" : "SYNC CHANGES"}
          </span>
        </button>
        <button className="border-2 border-[#353535] hover:border-[#c3c6d7] px-8 py-4 transition-colors">
          <span className="text-[14px] font-black tracking-[-0.7px] uppercase text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            DISCARD
          </span>
        </button>
      </div>

      {/* System info footer */}
      <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-4 flex flex-wrap gap-6">
        {[
          { label: "SEASON VERSION", value: "v4.0.1" },
          { label: "VENUE ZONE", value: "NORTH 44F" },
          { label: "UPTIME", value: "482:12:09" },
          { label: "FEED STATUS", value: "ACTIVE" },
          { label: "SCORE DELAY", value: "12ms" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[8px] uppercase text-[rgba(195,198,215,0.3)] mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
            <p className="text-[11px] font-bold text-[rgba(195,198,215,0.6)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
