import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export type AiButtonAppearance = "solid" | "outline";

export interface AiButtonStyleOptions {
  appearance?: AiButtonAppearance;
  fullWidth?: boolean;
  className?: string;
}

/** Shared classes for `<AiButton />`, `<AiLinkButton />`, or manual `<Link className={…} />`. */
export function aiButtonClassName(options?: AiButtonStyleOptions): string {
  const { appearance = "solid", fullWidth, className } = options ?? {};

  return cn(
    "group relative isolate inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-base font-semibold tracking-wide transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    fullWidth && "w-full",
    appearance === "outline"
      ? cn(
          "border border-cyan-400/35 bg-transparent text-foreground",
          "shadow-[inset_0_0_24px_rgba(34,211,238,0.06)]",
          "hover:border-orange-400/50 hover:bg-cyan-500/[0.06] hover:shadow-[0_0_32px_-10px_rgba(249,115,22,0.35)]",
        )
      : cn(
          "border border-orange-500/30 bg-gradient-to-br from-[#0c1528] via-[#070d18] to-[#030509] text-white",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_0_0_1px_rgba(249,115,22,0.18),0_16px_48px_-14px_rgba(220,38,38,0.38)]",
          "hover:border-orange-400/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(251,146,60,0.4),0_22px_56px_-14px_rgba(249,115,22,0.5)]",
        ),
    className,
  );
}

const glowLayerClassName =
  "pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(90%_70%_at_50%_-10%,rgba(249,115,22,0.22),transparent_52%)] opacity-60 transition-opacity duration-300 group-hover:opacity-100";

const shimmerLayerClassName =
  "pointer-events-none absolute inset-0 -translate-x-full skew-x-[-16deg] bg-gradient-to-r from-transparent via-white/[0.09] to-transparent opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100";

function AiChrome({ children }: PropsWithChildren) {
  return (
    <>
      <span className={glowLayerClassName} aria-hidden />
      <span className={shimmerLayerClassName} aria-hidden />
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">{children}</span>
    </>
  );
}

export interface AiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: AiButtonAppearance;
  fullWidth?: boolean;
}

export function AiButton({
  appearance = "solid",
  fullWidth,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: PropsWithChildren<AiButtonProps>) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        aiButtonClassName({ appearance, fullWidth }),
        "disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none",
        className,
      )}
      {...props}
    >
      <AiChrome>{children}</AiChrome>
    </button>
  );
}

export type AiLinkButtonProps = Omit<ComponentProps<typeof Link>, "className"> &
  AiButtonStyleOptions & { className?: string };

export function AiLinkButton({
  appearance = "solid",
  fullWidth,
  className,
  children,
  ...linkProps
}: PropsWithChildren<AiLinkButtonProps>) {
  return (
    <Link {...linkProps} className={cn(aiButtonClassName({ appearance, fullWidth }), "no-underline", className)}>
      <AiChrome>{children}</AiChrome>
    </Link>
  );
}
