import Link from "next/link";

const footerLinks = [
  { label: "MATCH ARCHIVE", href: "/dashboard/archive" },
  { label: "BETTING POLICY", href: "/dashboard/privacy" },
  { label: "MATCH LOGS", href: "/dashboard/logs" },
];

export default function Footer({ sidebarEnabled = true }: { sidebarEnabled?: boolean }) {
  return (
    <footer
      className={`bg-[#0e0e0e] border-t-2 border-[rgba(37,99,235,0.2)] flex items-center justify-between px-8 py-2 transition-[margin] duration-300 ${
        sidebarEnabled ? "ml-0" : "ml-0"
      }`}
    >
      <div className="flex items-center gap-6">
        <span
          className="text-[10px] tracking-[2px] uppercase text-[rgba(226,226,226,0.3)]"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          {`STUMPED.AI // CRICKET MATCH CENTRE`}
        </span>
        <div className="flex gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[10px] tracking-[2px] uppercase text-[rgba(226,226,226,0.3)] hover:text-[#b4c5ff] transition-colors"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#b4c5ff]" />
        <span
          className="text-[10px] tracking-[2px] uppercase text-[#b4c5ff]"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          LIVE FEED STABLE
        </span>
      </div>
    </footer>
  );
}
