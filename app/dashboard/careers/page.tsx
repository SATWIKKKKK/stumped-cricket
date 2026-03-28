export default function CareersPage() {
  return (
    <div className="p-6 sm:p-8 max-w-[900px] flex flex-col gap-6">
      <h1 className="text-[40px] sm:text-[56px] font-black tracking-[-2px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
        Careers
      </h1>
      <div className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)] space-y-4">
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          We are always looking for talented engineers, data scientists, and cricket strategists to join the Stumped AI team. If you are passionate about using technology to push the boundaries of sports analytics, we want to hear from you.
        </p>
        <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Current open roles are announced on our social channels. Reach out to us with your portfolio and a short note about why you want to work at the intersection of AI and cricket.
        </p>
      </div>
    </div>
  );
}
