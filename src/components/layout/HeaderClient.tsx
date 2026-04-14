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

  const isActive = (href: string) => {
    if (href === ROUTES.home) {
      return pathname === ROUTES.home;
    }
    return pathname.startsWith(href);
  };

  const shouldStick = !isHome || hasPassedHero;
  const headerClassName = shouldStick
    ? "sticky top-0 z-50 bg-black/55 backdrop-blur-xl transition-all duration-200"
    : "absolute left-0 right-0 top-0 z-50 bg-transparent transition-all duration-200";
  const logoClassName = "h-9 w-auto";
  const navTextClassName = "text-white/85";
  const getLinkClassName = (href: string) =>
    [
      "rounded-md px-3 py-2 text-sm transition-all duration-150",
      isActive(href) ? "bg-primary text-white" : "text-white/90 hover:bg-white/10",
    ].join(" ");

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
          <Link className={getLinkClassName(ROUTES.home)} href={ROUTES.home}>
            {uiText.navHome}
          </Link>
          {isAuthenticated ? (
            <>
              <Link className={getLinkClassName(ROUTES.admin)} href={ROUTES.admin}>
                {uiText.navAdmin}
              </Link>
              <Link className={getLinkClassName(ROUTES.preview)} href={ROUTES.preview}>
                {uiText.navPreview}
              </Link>
            </>
          ) : (
            <Link className={getLinkClassName(ROUTES.login)} href={ROUTES.login}>
              {uiText.navLogin}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
