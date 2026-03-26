export default function NetworkPage() {
  return (
    <div className="p-6 sm:p-8 max-w-[900px] flex flex-col gap-6">
      <h1 className="text-[40px] sm:text-[56px] font-black tracking-[-2px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
        Network Pulse
      </h1>
      <div className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)]">
        <p className="text-[12px] tracking-[2px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Live cricket feed health</p>
        <p className="text-[14px] text-[#c3c6d7] mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
          Uplink from venue cameras, score engine and commentary sources is healthy with low delay.
        </p>
      </div>
    </div>
  );
}
