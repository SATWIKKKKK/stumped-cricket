export default function EncryptPage() {
  return (
    <div className="p-6 sm:p-8 max-w-[900px] flex flex-col gap-6">
      <h1 className="text-[40px] sm:text-[56px] font-black tracking-[-2px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
        Feed Protection
      </h1>
      <div className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)]">
        <p className="text-[12px] tracking-[2px] uppercase text-[#b4c5ff] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Matchday security layer
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#0e0e0e] p-4">
            <p className="text-[10px] text-[rgba(195,198,215,0.5)] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Encryption mode</p>
            <p className="text-[18px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>AES 256 GCM</p>
          </div>
          <div className="bg-[#0e0e0e] p-4">
            <p className="text-[10px] text-[rgba(195,198,215,0.5)] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Feed tunnel</p>
            <p className="text-[18px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>Secure and stable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
