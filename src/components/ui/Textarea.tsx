import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-input bg-transparent px-4 py-3 text-foreground transition-all duration-150 ease-in-out focus:border-input focus:outline-none focus:ring-0",
        className,
      )}
      {...props}
    />
  );
}
