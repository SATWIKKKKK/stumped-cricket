export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1280px] animate-pulse">
      {/* Header skeleton */}
      <div className="border-l-4 border-[rgba(180,197,255,0.2)] pl-7 flex flex-col gap-3">
        <div className="h-12 w-64 bg-[#1b1b1b] rounded-none" />
        <div className="h-3 w-96 bg-[#1b1b1b] rounded-none" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#1b1b1b] border-t-2 border-[rgba(180,197,255,0.1)] p-6 flex flex-col gap-3">
            <div className="h-2 w-24 bg-[#2a2a2a]" />
            <div className="h-8 w-16 bg-[#2a2a2a]" />
            <div className="h-2 w-20 bg-[#2a2a2a]" />
          </div>
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-[#1b1b1b] h-64 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1b1b1b] h-48" />
            <div className="bg-[#1b1b1b] h-48" />
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#1b1b1b] h-48" />
          <div className="bg-[#2563eb] h-32 opacity-20" />
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#1b1b1b] h-12" />
            ))}
          </div>
        </div>
      </div>

      {/* System status bar */}
      <div className="bg-[#1b1b1b] h-px w-full opacity-20" />
      <div className="flex items-center justify-center gap-2 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] status-live" />
        <span
          className="text-[10px] font-bold tracking-[2px] uppercase text-[#b4c5ff]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          LOADING INTEL...
        </span>
      </div>
    </div>
  );
}
