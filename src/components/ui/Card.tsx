import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: PropsWithChildren<CardProps>) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)} {...props}>
      {children}
    </div>
  );
}
