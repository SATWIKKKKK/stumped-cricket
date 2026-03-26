"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, User, Lock, Mail, TerminalSquare } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-1.9 3v2.5h3.1c1.8-1.7 2.8-4.2 2.8-7 0-.7-.1-1.5-.2-2.2H12z" />
      <path fill="#34A853" d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3.1-2.5c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.4-4H3.4v2.6A10 10 0 0 0 12 22z" />
      <path fill="#4A90E2" d="M6.6 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.4A10 10 0 0 0 2 12c0 1.6.4 3.1 1.4 4.6L6.6 14z" />
      <path fill="#FBBC05" d="M12 6c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.8 3 14.5 2 12 2A10 10 0 0 0 3.4 7.4l3.2 2.6c.7-2.3 2.9-4 5.4-4z" />
    </svg>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [confirmAccessKey, setConfirmAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [popup, setPopup] = useState<{ title: string; message: string; kind: "success" | "error" } | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProviders() {
      try {
        const response = await fetch("/api/auth/providers", { cache: "no-store" });
        if (!response.ok) return;
        const providers = (await response.json()) as Record<string, unknown>;
        if (!ignore) {
          setGoogleEnabled(Boolean(providers?.google));
        }
      } catch {
        if (!ignore) {
          setGoogleEnabled(false);
        }
      }
    }

    loadProviders();

    return () => {
      ignore = true;
    };
  }, []);

  const showPopup = (title: string, message: string, kind: "success" | "error") => {
    setPopup({ title, message, kind });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        playerId,
        accessKey,
        confirmAccessKey,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setLoading(false);
      showPopup("Sign Up Failed", payload?.error ?? "Unable to create account.", "error");
      return;
    }

    const signedIn = await signIn("credentials", {
      playerId,
      accessKey,
      redirect: false,
    });

    setLoading(false);
    if (!signedIn?.ok) {
      showPopup("Account Created", "Your account is ready. Please sign in with your player ID.", "success");
      setTimeout(() => router.push("/auth/sign-in"), 1000);
      return;
    }

    router.push("/dashboard?auth=success");
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard?auth=success" });
  };

  const backgroundImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAReHZPlC7LVT1mS5T5Wq9W0M6lEb4AoQVRHRyFe54Zrhlz9UZUylZ2Gxx37H2fwuS5GbFnxxcJgHuZ0qq7VoHQb6CUiWAB4Fk1PvqqA7eEdNXUsuRj91PIpLzqqsl9bMeHpKoFa8wwtaJRZVFyxJRlzhvIsOPiSid-YqJjntbuLMQiDgdvIgnUKv6P8OHB2x7vrDxG5_tz65jeuWmhfEHZ-8vDoW6yfECKWKLBYjtqmczrR-Nfp8aB9SGVzkYsJ0dl4eGJRiATtwc";

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] relative overflow-x-hidden">
      <div className="fixed inset-0 grain-overlay z-50 pointer-events-none" />

      <div className="flex min-h-screen">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 z-10 bg-[#131313]">
          <div className="max-w-md w-full">
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <TerminalSquare size={28} className="text-[#2563eb]" />
                <h1 className="font-epilogue font-black text-2xl tracking-tight uppercase text-[#e2e2e2]">STUMPED AI</h1>
              </div>
            </div>

            <div className="bg-[#1b1b1b] p-8 border border-[rgba(67,70,85,0.2)] relative shadow-2xl">
             

              <h2 className="font-epilogue text-3xl font-black mb-8 tracking-tight text-[#e2e2e2] uppercase">CREATE  PROFILE</h2>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-1">
                  <label className="font-space text-[10px] font-bold text-[#c3c6d7] tracking-widest uppercase flex justify-between">
                    <span>FULL NAME</span>
                    <span className="text-[#2563eb]">REQUIRED</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="CRICKET USER"
                      className="w-full bg-[#0e0e0e] border-0 border-b-2 border-[#434655] focus:border-[#2563eb] focus:ring-0 text-[#e2e2e2] font-space p-3 transition-colors"
                      required
                    />
                    <User size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c3c6d7]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-space text-[10px] font-bold text-[#c3c6d7] tracking-widest uppercase flex justify-between">
                    <span>EMAIL IDENTIFIER</span>
                    <span className="text-[#2563eb]">REQUIRED</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="OPERATOR@STUMPED.AI"
                      className="w-full bg-[#0e0e0e] border-0 border-b-2 border-[#434655] focus:border-[#2563eb] focus:ring-0 text-[#e2e2e2] font-space p-3 transition-colors"
                      required
                    />
                    <Mail size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c3c6d7]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-space text-[10px] font-bold text-[#c3c6d7] tracking-widest uppercase">PLAYER ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      placeholder="PLAYER HANDLE"
                      className="w-full bg-[#0e0e0e] border-0 border-b-2 border-[#434655] focus:border-[#2563eb] focus:ring-0 text-[#e2e2e2] font-space p-3 transition-colors"
                      required
                    />
                    <User size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c3c6d7]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-space text-[10px] font-bold text-[#c3c6d7] tracking-widest uppercase">ACCESS KEY</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0e0e0e] border-0 border-b-2 border-[#434655] focus:border-[#2563eb] focus:ring-0 text-[#e2e2e2] font-space p-3 transition-colors"
                      required
                    />
                    <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c3c6d7]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-space text-[10px] font-bold text-[#c3c6d7] tracking-widest uppercase">VERIFY ACCESS KEY</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmAccessKey}
                      onChange={(e) => setConfirmAccessKey(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0e0e0e] border-0 border-b-2 border-[#434655] focus:border-[#2563eb] focus:ring-0 text-[#e2e2e2] font-space p-3 transition-colors"
                      required
                    />
                    <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c3c6d7]" />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2563eb] text-[#eeefff] font-epilogue font-black py-4 uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#e2e2e2] hover:text-[#131313] transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? "INITIALIZING PROFILE" : "INITIALIZE PROFILE"}
                    <ArrowRight size={16} />
                  </button>

                  {googleEnabled ? (
                    <button
                      type="button"
                      onClick={handleGoogleSignUp}
                      disabled={googleLoading}
                      className="w-full bg-[#0e0e0e] border border-[rgba(67,70,85,0.7)] hover:border-[#2563eb] px-4 py-3 text-[12px] font-bold tracking-[1px] uppercase text-[#e2e2e2] flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      <GoogleLogo />
                      {googleLoading ? "CONNECTING" : "SIGN UP WITH GOOGLE"}
                    </button>
                  ) : (
                    <p className="text-[10px] tracking-[1px] uppercase text-[#c3c6d7] text-center">
                      Google sign up is temporarily unavailable
                    </p>
                  )}
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-[rgba(67,70,85,0.2)] flex justify-between items-center gap-4">
                <span className="font-space text-[10px] text-[#e2e2e2] tracking-widest uppercase">EXISTING OPERATOR?</span>
                <Link href="/auth/sign-in" className="font-space text-[10px] font-bold text-[#b4c5ff] hover:text-white hover:underline tracking-widest uppercase">
                  SIGN IN LOCALLY
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 bg-[#0e0e0e] relative overflow-hidden border-l border-[rgba(67,70,85,0.2)]">
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundImageUrl}
              alt="High tech server room background"
              className="w-full h-full object-cover grayscale opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full h-full p-16 flex flex-col justify-between">
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-4">
                <div className="inline-block bg-[#2563eb]/20 backdrop-blur-md px-4 py-2 border border-[#2563eb]/30">
                  <p className="font-space text-xs font-bold text-[#2563eb] tracking-widest uppercase">SYSTEM STATUS: NOMINAL</p>
                </div>
                <div className="font-epilogue text-6xl font-black text-[#e2e2e2] leading-none tracking-tight flex flex-col uppercase">
                  <span>WELCOME</span>
                  <span className="text-[#2563eb]">ONBOARD</span>
                  <span>CRICK SICK!</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end items-end">
              <div className="font-space text-[10px] text-[#c3c6d7] leading-relaxed text-right uppercase tracking-wider max-w-[220px]">
                "THE ARCHITECTURE OF COGNITION REQUIRES A FOUNDATION OF UNYIELDING DATA."
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#2563eb]/10 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#2563eb]/5 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 p-4 font-space text-[8px] text-[#c3c6d7]/30 flex gap-8 uppercase">
            <span>COORD: 34.0522 N, 118.2437 W</span>
            <span>SEC LVM: 09</span>
            <span>BUILD: 4.8.2 STABLE</span>
          </div>
        </div>
      </div>

      {popup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.5)] p-6 max-w-md w-full">
            <h3 className={`text-[20px] font-black uppercase mb-2 ${popup.kind === "success" ? "text-[#b4c5ff]" : "text-[#ff6b6b]"}`} style={{ fontFamily: "'Epilogue', sans-serif" }}>
              {popup.title}
            </h3>
            <p className="text-[13px] text-[#c3c6d7]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {popup.message}
            </p>
            <button
              onClick={() => setPopup(null)}
              className="mt-5 bg-[#2563eb] px-4 py-2 text-[11px] font-bold uppercase text-white tracking-[1px]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
        }

        .ticket-cut {
          clip-path: polygon(
            0% 0%, 100% 0%, 100% 95%, 98% 97%, 95% 95%, 92% 97%, 89% 95%, 86% 97%, 83% 95%, 80% 97%, 77% 95%, 74% 97%, 71% 95%, 68% 97%, 65% 95%, 62% 97%, 59% 95%, 56% 97%, 53% 95%, 50% 97%, 47% 95%, 44% 97%, 41% 95%, 38% 97%, 35% 95%, 32% 97%, 29% 95%, 26% 97%, 23% 95%, 20% 97%, 17% 95%, 14% 97%, 11% 95%, 8% 97%, 5% 95%, 2% 97%, 0% 95%
          );
        }
      `}</style>
    </div>
  );
}
