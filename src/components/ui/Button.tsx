import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[#ff4d00] text-white hover:opacity-90 px-6 py-3 font-medium",
  secondary: "bg-secondary text-secondary-foreground hover:bg-accent px-6 py-3",
  ghost: "bg-transparent border border-border text-foreground hover:bg-secondary px-6 py-3",
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "rounded-md transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
