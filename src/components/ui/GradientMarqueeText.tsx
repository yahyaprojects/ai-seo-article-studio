"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface GradientMarqueeTextProps {
  text: string;
  /** Full loop duration (0% → 100% → 0%), seconds — matches Framer `duration: 5` feel */
  duration?: number;
  gradientColors?: string[];
  className?: string;
}

export function GradientMarqueeText({
  text,
  duration = 5,
  gradientColors = ["#5c150f", "#9e2319", "#d4301e", "#e85d4a", "#ff8f70", "#d4301e"],
  className,
}: GradientMarqueeTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    gsap.set(el, { backgroundPosition: "0% 50%" });

    const tween = gsap.to(el, {
      backgroundPosition: "100% 50%",
      duration: duration / 2,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "backgroundPosition" });
    };
  }, [duration, text, gradientColors.join(",")]);

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block bg-clip-text font-heading text-3xl font-medium leading-[1.06] text-transparent md:text-5xl lg:text-6xl",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {text}
    </span>
  );
}
