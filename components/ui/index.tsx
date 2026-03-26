import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/* ─── Section Header ──────────────────────────────────────────── */
export function SectionHeader({
  title,
  subtitle,
  badge,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2", className)}>
      <h1
        className="text-[clamp(32px,5vw,60px)] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none"
        style={{ fontFamily: "'Epilogue', sans-serif" }}
      >
        {title}
      </h1>
      {(subtitle || badge) && (
        <div className="flex items-center gap-4 flex-wrap">
          {subtitle && (
            <span
              className="text-[12px] tracking-[3.6px] uppercase text-[rgba(226,226,226,0.4)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {subtitle}
            </span>
          )}
          {subtitle && <div className="flex-1 h-px bg-[rgba(67,70,85,0.2)] hidden sm:block" />}
          {badge && (
            <div className="bg-[#e2e2e2] px-2 py-0.5 shrink-0">
              <span
                className="text-[10px] font-bold uppercase text-[#131313]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {badge}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  valueColor = "text-[#b4c5ff]",
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  valueColor?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-4 sm:p-6 flex flex-col gap-2 border-t-2",
        accent
          ? "bg-[#2563eb] border-[#1d4ed8]"
          : "bg-[#1b1b1b] border-[rgba(180,197,255,0.3)]"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-[10px] font-bold tracking-[1.2px] uppercase",
            accent ? "text-[rgba(238,239,255,0.7)]" : "text-[#b4c5ff]"
          )}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {label}
        </span>
        {Icon && (
          <Icon
            size={14}
            className={accent ? "text-[rgba(238,239,255,0.4)]" : "text-[rgba(180,197,255,0.4)]"}
          />
        )}
      </div>
      <p
        className={cn("text-[28px] sm:text-[36px] font-bold leading-none", valueColor)}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {value}
      </p>
      {sub && (
        <span
          className="text-[9px] tracking-[1.6px] uppercase text-[rgba(195,198,215,0.4)]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

/* ─── Badge / Tag ─────────────────────────────────────────────── */
export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "blue" | "light" | "red" | "green" | "live";
  className?: string;
}) {
  const variants = {
    default: "bg-[#353535] text-[#c3c6d7]",
    blue: "bg-[#2563eb] text-white",
    light: "bg-[#b4c5ff] text-[#131313]",
    red: "bg-[rgba(255,69,58,0.2)] text-[#ff453a]",
    green: "bg-[rgba(52,199,89,0.2)] text-[#34c759]",
    live: "bg-[#2563eb] text-white",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-[9px] font-bold uppercase inline-flex items-center gap-1",
        variants[variant],
        className
      )}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {variant === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-white status-live inline-block" />
      )}
      {children}
    </span>
  );
}

/* ─── Progress Bar ────────────────────────────────────────────── */
export function ProgressBar({
  value,
  max = 100,
  label,
  valueLabel,
  color = "bg-[#2563eb]",
}: {
  value: number;
  max?: number;
  label?: string;
  valueLabel?: string;
  color?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || valueLabel) && (
        <div className="flex items-center justify-between">
          {label && (
            <span
              className="text-[10px] tracking-[1px] uppercase text-[#e2e2e2]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {label}
            </span>
          )}
          {valueLabel && (
            <span
              className="text-[10px] tracking-[1px] text-[#b4c5ff]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {valueLabel}
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 bg-[#353535] w-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Card ────────────────────────────────────────────────────── */
export function Card({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-[#1b1b1b] border border-[rgba(67,70,85,0.1)]",
        hover && "hover:bg-[#2a2a2a] hover:border-[rgba(180,197,255,0.2)] transition-colors cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Panel Header (small section label) ─────────────────────── */
export function PanelHeader({
  title,
  sub,
  dot = true,
}: {
  title: string;
  sub?: string;
  dot?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {dot && <div className="w-2 h-2 bg-[#b4c5ff] shrink-0" />}
        <span
          className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </span>
      </div>
      {sub && (
        <span
          className="text-[10px] text-[rgba(195,198,215,0.4)]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

/* ─── Divider ─────────────────────────────────────────────────── */
export function Divider({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <div className="w-px bg-[rgba(67,70,85,0.2)] self-stretch" />
  ) : (
    <div className="h-px w-full bg-[rgba(67,70,85,0.2)]" />
  );
}

/* ─── Empty State ─────────────────────────────────────────────── */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-40">
      <div className="w-px h-8 bg-[#353535]" />
      <span
        className="text-[11px] font-bold tracking-[2px] uppercase text-[#c3c6d7]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {message}
      </span>
      <div className="w-px h-8 bg-[#353535]" />
    </div>
  );
}

/* ─── Status Indicator ────────────────────────────────────────── */
export function StatusDot({
  status,
  label,
}: {
  status: "live" | "active" | "idle" | "error";
  label?: string;
}) {
  const colors = {
    live: "bg-[#2563eb]",
    active: "bg-[#34c759]",
    idle: "bg-[#353535]",
    error: "bg-[#ff453a]",
  };
  const textColors = {
    live: "text-[#2563eb]",
    active: "text-[#34c759]",
    idle: "text-[rgba(195,198,215,0.4)]",
    error: "text-[#ff453a]",
  };
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-2 h-2 rounded-full shrink-0",
          colors[status],
          (status === "live" || status === "active") && "status-live"
        )}
      />
      {label && (
        <span
          className={cn("text-[10px] font-bold tracking-[1px] uppercase", textColors[status])}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
