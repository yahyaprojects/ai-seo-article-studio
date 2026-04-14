import Link from "next/link";

import { APP_CONFIG, ROUTES, UI_TEXT } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href={ROUTES.home} className="font-heading text-xl text-hero-text">
          {APP_CONFIG.brandName}
        </Link>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="rounded-md px-3 py-2 hover:bg-secondary" href={ROUTES.home}>
            {UI_TEXT.navHome}
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-secondary" href={ROUTES.admin}>
            {UI_TEXT.navAdmin}
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-secondary" href={ROUTES.preview}>
            {UI_TEXT.navPreview}
          </Link>
        </div>
      </nav>
    </header>
  );
}
