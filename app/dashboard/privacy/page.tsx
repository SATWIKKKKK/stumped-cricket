export default function PrivacyPage() {
  return (
    <div className="p-6 sm:p-8 max-w-[900px] flex flex-col gap-6">
      <h1 className="text-[40px] sm:text-[56px] font-black tracking-[-2px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
        Fan Play Policy
      </h1>
      <div className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)]">
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Stumped AI does not host betting flows. We provide cricket analytics, player intelligence and match insights.
          Any external fantasy or play platform must follow local regulation and transparent fair-use rules.
        </p>
      </div>
    </div>
  );
}
