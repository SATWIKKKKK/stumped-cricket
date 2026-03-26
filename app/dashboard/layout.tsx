"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarEnabled, setSidebarEnabled] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const authSuccess = searchParams.get("auth") === "success";

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev);
      return;
    }
    setSidebarEnabled((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#131313] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          sidebarEnabled ? "lg:translate-x-0" : "lg:-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ${sidebarEnabled ? "lg:ml-64" : "lg:ml-0"}`}>
        <TopNav
          onMenuClick={toggleSidebar}
          sidebarEnabled={sidebarEnabled}
        />
        <main className="flex-1 pt-[69px]">
          <div className="min-h-[calc(100vh-69px-48px)]">{children}</div>
        </main>
        <Footer sidebarEnabled={sidebarEnabled} />
      </div>

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
  );
}
