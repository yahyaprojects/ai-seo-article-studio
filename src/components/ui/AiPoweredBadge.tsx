import { MdAutoAwesome } from "react-icons/md";

/** Hero pill: “AI powered” with a continuous shine sweep (see `globals.css`). */
export function AiPoweredBadge() {
  return (
    <span className="ai-powered-badge relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.07] px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 shadow-[0_0_28px_-10px_rgba(255,58,36,0.4)] backdrop-blur-md">
      <span aria-hidden className="ai-powered-badge__shine pointer-events-none absolute inset-y-0 -left-[55%] w-[55%] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <span className="relative z-[1] inline-flex items-center gap-2">
        <MdAutoAwesome aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary" />
        AI powered
      </span>
    </span>
  );
}
