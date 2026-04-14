import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
}

export function Badge({ children, className }: PropsWithChildren<BadgeProps>) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
