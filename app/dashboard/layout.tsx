"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/lib/ThemeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authSuccess = searchParams.get("auth") === "success";

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#131313] flex flex-col">
      {/* Grain overlay */}
      <div className="fixed inset-0 grain-overlay z-[60] pointer-events-none" />

      <TopNav />

      <main className="flex-1 pt-[69px]">
        <div className="min-h-[calc(100vh-69px-48px)]">{children}</div>
      </main>
      <Footer />

      {authSuccess && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.5)] p-6 max-w-md w-full">
            <h3 className="text-[20px] font-black uppercase text-[#b4c5ff] mb-2" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              Entry Confirmed
            </h3>
            <p className="text-[13px] text-[#c3c6d7]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Authentication complete. Welcome to the cricket intelligence hub.
            </p>
            <button
              onClick={() => router.replace("/dashboard")}
              className="mt-5 bg-[#2563eb] px-4 py-2 text-[11px] font-bold uppercase text-white tracking-[1px]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
    </ThemeProvider>
  );
}
