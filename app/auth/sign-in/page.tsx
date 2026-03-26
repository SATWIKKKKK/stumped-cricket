"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Lock } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

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

export default function SignInPage() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState("");
  const [accessKey, setAccessKey] = useState("");
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId.trim() || !accessKey.trim()) {
      showPopup("Access Denied", "Player ID and access key are required.", "error");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      playerId,
      accessKey,
      redirect: false,
    });
    setLoading(false);

    if (result?.ok) {
      router.push("/dashboard?auth=success");
      return;
    }

    showPopup(
      "Access Denied",
      "You are not allowed to enter the stadium. Player ID and access key do not match our records.",
      "error"
    );
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard?auth=success" });
  };

  return (
    <div className="relative min-h-screen bg-[#131313] flex flex-col items-center justify-center overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(67,70,85,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(67,70,85,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2563eb] blur-[120px]" />
      </div>

      {/* Vertical data stream */}
      <div className="absolute right-8 top-1/4 bottom-1/4 w-px bg-[#353535] opacity-20">
        <div
          className="absolute left-[-22px] top-1/2 -translate-y-1/2"
          style={{ transform: "rotate(90deg) translateY(-50%)", whiteSpace: "nowrap" }}
        >
          <span
            className="text-[8px] tracking-[4px] text-[#c3c6d7] font-space-grotesk uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            MATCHDAY TIMER 482:12:09:44
          </span>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4">
        <div className="w-12 h-12 border-l-2 border-t-2 border-[#353535] opacity-30" />
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="w-12 h-12 border-r-2 border-b-2 border-[#353535] opacity-30" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[448px] px-6">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8 gap-2">
          <h1
            className="text-[36px] font-black tracking-[-1.8px] uppercase text-[#e2e2e2]"
            style={{ fontFamily: "'Epilogue', sans-serif" }}
          >
            STUMPED AI
          </h1>
          <div className="flex items-center gap-2">
           
            <span
              className="text-[10px] tracking-[2px] uppercase text-[#c3c6d7]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
           
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#1b1b1b] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] relative overflow-hidden">
          {/* Progress bar top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#353535]">
            <div className="absolute inset-y-0 left-0 w-1/3 bg-[#2563eb]" />
          </div>

          <div className="p-10 pt-10 flex flex-col gap-8">
            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h2
                className="text-[20px] font-bold tracking-[-0.5px] uppercase text-[#e2e2e2]"
                style={{ fontFamily: "'Epilogue', sans-serif" }}
              >
                MATCHDAY SIGN IN
              </h2>
              <p
                className="text-[12px] text-[#c3c6d7]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
               
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="flex flex-col gap-6">
              {/* Player ID field */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[10px] font-bold tracking-[1px] uppercase text-[#c3c6d7]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    PLAYER ID
                  </label>
                  <span
                    className="text-[10px] font-bold tracking-[1px] uppercase text-[#2563eb] opacity-50"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    REQUIRED
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder="PLAYER HANDLE"
                    className="w-full bg-[#0e0e0e] border-b-2 border-[#353535] focus:border-[#2563eb] px-3 py-3 text-[14px] text-[#e2e2e2] placeholder-[#353535] outline-none transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <User size={9} className="text-[#c3c6d7]" />
                  </div>
                </div>
              </div>

              {/* Access Key field */}
              <div className="flex flex-col gap-2 pb-4">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[10px] font-bold tracking-[1px] uppercase text-[#c3c6d7]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    FAN PASSCODE
                  </label>
                  <span
                    className="text-[10px] font-bold tracking-[1px] uppercase text-[#2563eb] opacity-50"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    MATCHSAFE
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="********"
                    className="w-full bg-[#0e0e0e] border-b-2 border-[#353535] focus:border-[#2563eb] px-3 py-3 text-[14px] text-[#e2e2e2] placeholder-[#353535] outline-none transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Lock size={10} className="text-[#c3c6d7]" />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] flex items-center justify-between px-6 py-4 transition-colors group disabled:opacity-60"
              >
                <span
                  className="text-[16px] font-black tracking-[-0.8px] uppercase text-[#eeefff]"
                  style={{ fontFamily: "'Epilogue', sans-serif" }}
                >
                  {loading ? "VERIFYING LINEUP..." : "ENTER CRICKET HUB"}
                </span>
                <ArrowRight
                  size={16}
                  className="text-[#eeefff] group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="border-t border-[#353535] pt-6">
                {googleEnabled ? (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full bg-[#0e0e0e] border border-[rgba(67,70,85,0.7)] hover:border-[#2563eb] px-4 py-3 text-[12px] font-bold tracking-[1px] uppercase text-[#e2e2e2] flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <GoogleLogo />
                    {googleLoading ? "Connecting..." : "Sign In With Google"}
                  </button>
                ) : (
                  <p
                    className="text-[10px] tracking-[1px] uppercase text-[#c3c6d7] text-center"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Google sign in is temporarily unavailable
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer meta */}
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SCORE DELAY: 12MS
            </span>
            <span className="text-[9px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SCORE FEED: ACTIVE
            </span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/sign-up"
              className="text-[10px] tracking-[1px] uppercase text-[#c3c6d7] hover:text-[#b4c5ff] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Go To Sign Up
            </Link>
            <Link
              href="/dashboard/logs"
              className="text-[10px] tracking-[1px] uppercase text-[#c3c6d7] hover:text-[#b4c5ff] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Match Logs
            </Link>
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
    </div>
  );
}
