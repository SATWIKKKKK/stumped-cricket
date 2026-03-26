export default function RadarPage() {
  return (
    <div className="p-6 sm:p-8 max-w-[900px] flex flex-col gap-6">
      <h1 className="text-[40px] sm:text-[56px] font-black tracking-[-2px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
        Match Radar
      </h1>
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-6">
        <p className="text-[13px] text-[#c3c6d7]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Real-time radar view for pace, spin pressure, scoring zones and phase momentum.
        </p>
      </div>
    </div>
  );
}
