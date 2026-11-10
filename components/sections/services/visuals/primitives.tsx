import type { ReactNode } from "react";

/*
 * Building blocks for the illustrative service compositions.
 * Everything scales with the frame via container-query units (cqw), so the
 * same markup works in the pinned desktop stage and on a 320px phone.
 * Compositions are decorative: the frame is aria-hidden.
 */

/** Text sizes relative to the frame width. */
export const t = {
  xs: "text-[max(7px,2.1cqw)] leading-tight",
  sm: "text-[max(8px,2.6cqw)] leading-tight",
  md: "text-[max(10px,3.6cqw)] leading-tight",
} as const;

export function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="@container relative size-full overflow-hidden rounded-card border border-white/10 bg-navy-950"
    >
      {/* Faint engineering grid — the shared backdrop of every composition. */}
      <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-size-[8cqw_8cqw]" />
      {/* Restrained blue light from one corner, not a glow effect. */}
      <div className="absolute -right-1/4 -top-1/4 size-3/4 rounded-full bg-blue-500/10 blur-3xl" />
      {children}
    </div>
  );
}

type PanelProps = {
  className?: string;
  children?: ReactNode;
  accent?: boolean;
};

/** A floating interface panel. `className` positions it (absolute %, sizes). */
export function Panel({ className = "", children, accent = false }: PanelProps) {
  return (
    <div
      data-v-el
      className={`absolute rounded-[1.6cqw] border bg-navy-900 shadow-[0_2cqw_5cqw_-1cqw_rgb(0_0_0/0.7)] ${
        accent ? "border-blue-500/60" : "border-white/10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Skeleton text line. */
export function Line({ className = "", strong = false }: { className?: string; strong?: boolean }) {
  return (
    <div
      className={`h-[1.1cqw] min-h-[3px] rounded-full ${strong ? "bg-silver-200/70" : "bg-silver-400/25"} ${className}`}
    />
  );
}

/** Window chrome with three dots and an optional address pill. */
export function WindowBar({ url }: { url?: string }) {
  return (
    <div className="flex items-center gap-[0.8cqw] border-b border-white/10 px-[1.6cqw] py-[1.2cqw]">
      <span className="size-[1.1cqw] min-h-[3px] min-w-[3px] rounded-full bg-silver-400/40" />
      <span className="size-[1.1cqw] min-h-[3px] min-w-[3px] rounded-full bg-silver-400/40" />
      <span className="size-[1.1cqw] min-h-[3px] min-w-[3px] rounded-full bg-silver-400/40" />
      {url ? (
        <span className={`ml-[1.5cqw] flex-1 truncate rounded-full bg-white/5 px-[1.4cqw] py-[0.3cqw] text-silver-400 ${t.xs}`}>
          {url}
        </span>
      ) : null}
    </div>
  );
}

/** Small uppercase label used inside panels. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono uppercase tracking-[0.12em] text-silver-400 ${t.xs} ${className}`}>
      {children}
    </span>
  );
}
