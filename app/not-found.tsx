import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(67,70,85,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(67,70,85,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4">
        <div className="w-12 h-12 border-l-2 border-t-2 border-[#353535] opacity-30" />
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="w-12 h-12 border-r-2 border-b-2 border-[#353535] opacity-30" />
      </div>

      <div className="text-center relative z-10 px-8">
        {/* 404 large text */}
        <p
          className="text-[160px] sm:text-[200px] font-black text-[rgba(37,99,235,0.08)] leading-none tracking-[-8px] select-none"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          404
        </p>

        <div className="flex items-center justify-center gap-2 mb-4 -mt-8">
          <div className="w-2 h-2 bg-[#2563eb]" />
          <span
            className="text-[12px] font-bold tracking-[3px] uppercase text-[#2563eb]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            MATCH NOT FOUND
          </span>
        </div>

        <h1
          className="text-[clamp(28px,5vw,48px)] font-black tracking-[-2px] uppercase text-[#e2e2e2] mb-4"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          STUMPS CALLED
        </h1>

        <p
          className="text-[14px] sm:text-[16px] text-[#c3c6d7] leading-7 max-w-md mx-auto mb-8"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          The match page you are looking for is unavailable or no longer active. Return to the main scoreboard.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 bg-[#2563eb] hover:bg-[#1d4ed8] px-8 py-4 transition-colors group"
        >
          <span
            className="text-[14px] font-black tracking-[-0.7px] uppercase text-[#eeefff]"
            style={{ fontFamily: "'Epilogue', sans-serif" }}
          >
            RETURN TO SCOREBOARD
          </span>
          <ArrowRight size={14} className="text-[#eeefff] group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Footer status */}
        <div className="mt-12 flex items-center justify-center gap-3 opacity-40">
          <span
            className="text-[9px] tracking-[2px] uppercase text-[#c3c6d7]"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            STUMPED.AI // ERR MATCH MISSING
          </span>
        </div>
      </div>
    </div>
  );
}
