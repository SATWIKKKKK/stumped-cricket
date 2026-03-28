export default function AboutPage() {
  return (
    <div className="p-6 sm:p-8 max-w-[900px] flex flex-col gap-6">
      <h1 className="text-[40px] sm:text-[56px] font-black tracking-[-2px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
        About Us
      </h1>
      <div className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)] space-y-4">
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Stumped AI is an industrial-grade cricket intelligence platform built by a team of cricket obsessives, data scientists, and AI engineers. We believe the future of cricket strategy lies at the intersection of biomechanics, machine learning, and real-time data.
        </p>
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Our platform delivers 50+ analytical modules — from DRS simulation with full aerodynamic modelling to AI-generated match narratives — all designed for coaches, analysts, broadcasters, and fans who refuse to settle for surface-level statistics.
        </p>
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Founded with the mission to decode every ball ever bowled, Stumped AI processes billions of data points to give you the tactical edge that was previously impossible to obtain.
        </p>
      </div>
    </div>
  );
}
