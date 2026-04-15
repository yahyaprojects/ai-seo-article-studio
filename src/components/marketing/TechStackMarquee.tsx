"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

/** Pixels per second; higher with large type so the loop does not feel sluggish */
const SCROLL_SPEED_PX = 200;

interface TechStackMarqueeProps {
  items: string[];
}

export function TechStackMarquee({ items }: TechStackMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || items.length === 0) {
      return;
    }

    let tween: gsap.core.Tween | null = null;

    const run = () => {
      tween?.kill();
      gsap.set(track, { x: 0 });
      const half = track.scrollWidth / 2;
      if (half < 1) {
        return;
      }
      tween = gsap.to(track, {
        x: -half,
        duration: half / SCROLL_SPEED_PX,
        ease: "none",
        repeat: -1,
      });
    };

    run();
    const ro = new ResizeObserver(() => {
      run();
    });
    ro.observe(root);
    ro.observe(track);

    return () => {
      ro.disconnect();
      tween?.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  }, [items]);

  const loopItems = [...items, ...items];

  return (
    <div
      ref={rootRef}
      className="relative left-1/2 right-1/2 -mx-[50vw] flex min-h-[100vh] w-screen flex-col justify-center overflow-hidden bg-transparent py-6"
      aria-label="Stack tecnológico"
    >
      <div ref={trackRef} className="flex w-max items-center gap-x-20 md:gap-x-32">
        {loopItems.map((tech, index) => (
          <span
            key={`${tech}-${index}`}
            className="whitespace-nowrap font-mono text-[2.75rem] font-bold uppercase leading-none tracking-[0.12em] text-muted-foreground/90"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
