"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ROUTES } from "@/lib/constants";

type HeaderClientProps = {
  appName: string;
  isAuthenticated: boolean;
  uiText: {
    navHome: string;
    navAdmin: string;
    navPreview: string;
    navLogin: string;
  };
};

export function HeaderClient({ appName, isAuthenticated, uiText }: HeaderClientProps) {
  const pathname = usePathname();
  const isHome = pathname === ROUTES.home;
  const [hasPassedHero, setHasPassedHero] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setHasPassedHero(true);
      return;
    }

    const onScroll = () => {
      const heroElement = document.getElementById("home-hero");
      const heroHeight = heroElement?.offsetHeight ?? window.innerHeight;
      const stickyThreshold = Math.max(heroHeight - 72, 0);
      setHasPassedHero(window.scrollY >= stickyThreshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  const shouldStick = !isHome || hasPassedHero;
  const headerClassName = shouldStick
    ? "sticky top-0 z-50 bg-black/20 backdrop-blur-xl transition-all duration-200"
    : "absolute left-0 right-0 top-0 z-50 bg-transparent transition-all duration-200";
  const logoClassName = shouldStick ? "h-9 w-auto" : "h-9 w-auto";
  const navTextClassName = shouldStick ? "text-muted-foreground" : "text-white/85";
  const linkClassName = shouldStick
    ? "rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
    : "rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10";

  return (
    <header className={headerClassName}>
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href={ROUTES.home} className="inline-flex items-center">
          <Image
            src="/assets/branding/logo.png"
            alt={`${appName} logo`}
            width={160}
            height={36}
            priority
            className={logoClassName}
          />
          <span className="sr-only">{appName}</span>
        </Link>
        <div className={`flex items-center gap-3 ${navTextClassName}`}>
          <Link className={linkClassName} href={ROUTES.home}>
            {uiText.navHome}
          </Link>
          {isAuthenticated ? (
            <>
              <Link className={linkClassName} href={ROUTES.admin}>
                {uiText.navAdmin}
              </Link>
              <Link className={linkClassName} href={ROUTES.preview}>
                {uiText.navPreview}
              </Link>
            </>
          ) : (
            <Link className={linkClassName} href={ROUTES.login}>
              {uiText.navLogin}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
