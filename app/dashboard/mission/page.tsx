export default function MissionPage() {
  return (
    <div className="p-6 sm:p-8 max-w-[900px] flex flex-col gap-6">
      <h1 className="text-[40px] sm:text-[56px] font-black tracking-[-2px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
        Our Mission
      </h1>
      <div className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)] space-y-4">
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Our mission is to eliminate tactical blind spots in cricket through AI-powered intelligence systems. We want every coach, analyst, and fan to have access to the same calibre of insights that were once reserved for a handful of elite franchises.
        </p>
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          We are building neural networks trained on every ball bowled in professional cricket since 1970, simulating physics down to drag coefficients and Magnus force vectors, and delivering real-time tactical suggestions with sub-200ms latency.
        </p>
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Cricket is a game of margins. We exist to make sure those margins work in your favour.
        </p>
      </div>
    </div>
  );
}
