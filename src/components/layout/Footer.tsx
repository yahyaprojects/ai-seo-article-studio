import { UI_TEXT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-6 text-sm text-muted-foreground">
        {UI_TEXT.footerText}
      </div>
    </footer>
  );
}
