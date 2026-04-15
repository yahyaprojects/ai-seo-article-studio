import Link from "next/link";

import { APP_CONFIG, ROUTES, UI_TEXT } from "@/lib/constants";

const year = new Date().getFullYear();

const linkClass =
  "text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:text-primary";

export function Footer() {
  return (
    <footer className="relative border-t border-border/80 bg-gradient-to-b from-background via-card/20 to-card/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(212,48,30,0.06),transparent)]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-10 pt-14 md:pb-12 md:pt-16">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="font-heading text-lg font-semibold tracking-tight text-foreground">{APP_CONFIG.brandName}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{UI_TEXT.footerTagline}</p>
          </div>

          <nav aria-label="Pie de página — explorar" className="md:col-span-3 md:col-start-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/90">Explorar</p>
            <ul className="mt-5 grid gap-3">
              <li>
                <Link className={linkClass} href={ROUTES.home}>
                  {UI_TEXT.navHome}
                </Link>
              </li>
              <li>
                <Link className={linkClass} href={`${ROUTES.home}#como-funciona`}>
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link className={linkClass} href={ROUTES.preview}>
                  Blog preview
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Pie de página — cuenta" className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/90">Cuenta</p>
            <ul className="mt-5 grid gap-3">
              <li>
                <Link className={linkClass} href={ROUTES.login}>
                  {UI_TEXT.navLogin}
                </Link>
              </li>
              <li>
                <Link className={linkClass} href={ROUTES.admin}>
                  {UI_TEXT.navAdmin}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {APP_CONFIG.brandName}. {APP_CONFIG.siteName}.
          </p>
          <p className="max-w-prose text-right md:text-left">{UI_TEXT.footerText}</p>
        </div>
      </div>
    </footer>
  );
}
