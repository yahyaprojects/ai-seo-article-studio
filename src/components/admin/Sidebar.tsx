"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiLogOut,
  FiMenu,
  FiX,
  FiZap,
} from "react-icons/fi";

import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { useArticleStore } from "@/stores/useArticleStore";

const SIDEBAR_COLLAPSED_KEY = "propulsa-admin-sidebar-collapsed";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  exact?: boolean;
  badge?: number;
}

/* ─── Single nav item ─────────────────────────────────────────────────────── */

function NavLink({
  href,
  icon: Icon,
  label,
  exact,
  badge,
  collapsed,
  onNavigate,
}: NavItem & { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  const cls = isActive
    ? "bg-primary/10 text-primary"
    : "text-gray-400 hover:text-white hover:bg-white/5";

  const inner = (
    <span
      className={`relative flex items-center rounded-lg text-sm font-medium transition-all duration-150 ${cls} ${
        collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
      }`}
      title={label}
    >
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      {isActive && collapsed && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      <span className="relative shrink-0">
        <Icon className="h-4 w-4" />
        {collapsed && badge !== undefined && badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-white">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </span>
      <span className={collapsed ? "sr-only" : "flex-1"}>{label}</span>
      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary/15 px-1.5 text-[11px] font-semibold text-primary">
          {badge}
        </span>
      )}
    </span>
  );

  return (
    <Link href={href} onClick={onNavigate}>
      {inner}
    </Link>
  );
}

/* ─── Main Sidebar component ──────────────────────────────────────────────── */

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const articleCount = useArticleStore((state) => state.articles.length);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored === "1") {
        setIsCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const collapsed = isCollapsed && isDesktop;

  function setCollapsed(next: boolean) {
    setIsCollapsed(next);
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
    } catch {
      // ignore
    }
  }

  const navItems: NavItem[] = [
    { href: ROUTES.home, icon: FiHome, label: "Inicio", exact: true },
    { href: "/admin", icon: FiZap, label: "Generar artículo", exact: true },
    {
      href: "/admin/articles",
      icon: FiBookOpen,
      label: "Artículos",
      exact: false,
      badge: articleCount,
    },
  ];

  function closeMobile() {
    setMobileOpen(false);
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo + collapse (desktop) */}
      <div
        className={`flex shrink-0 border-b border-white/[0.07] ${
          collapsed
            ? "flex-col items-center gap-2 py-3 lg:min-h-[4.5rem]"
            : "h-16 items-center justify-between gap-2 px-4"
        }`}
      >
        {!collapsed ? (
          <Image
            src="/assets/branding/logo.png"
            alt={APP_CONFIG.brandName}
            width={130}
            height={30}
            priority
            className="h-7 w-auto max-w-[140px] brightness-[10]"
          />
        ) : (
          <Image
            src="/assets/branding/favicon.svg"
            alt={APP_CONFIG.brandName}
            width={32}
            height={32}
            priority
            className="h-8 w-8"
          />
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!isCollapsed)}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white lg:flex"
          aria-label={collapsed ? "Expandir menú lateral" : "Contraer menú lateral"}
          title={collapsed ? "Expandir" : "Contraer"}
        >
          {collapsed ? <FiChevronRight className="h-5 w-5" /> : <FiChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className={`flex-1 overflow-y-auto py-5 ${collapsed ? "px-2" : "px-3"}`}>
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">Panel</p>
        )}
        <ul className="grid gap-0.5">
          {navItems.map((item) => (
            <li key={item.href + item.label}>
              <NavLink {...item} collapsed={collapsed} onNavigate={closeMobile} />
            </li>
          ))}
        </ul>

        {!collapsed && articleCount > 0 && (
          <div className="mt-6 rounded-lg border border-white/[0.07] bg-white/[0.03] p-3">
            <p className="text-[11px] font-medium text-gray-500">Esta sesión</p>
            <p className="mt-0.5 text-lg font-semibold text-white">
              {articleCount}
              <span className="ml-1 text-sm font-normal text-gray-400">
                {articleCount === 1 ? "artículo" : "artículos"}
              </span>
            </p>
          </div>
        )}
        {collapsed && articleCount > 0 && (
          <div
            className="mx-auto mt-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-xs font-semibold text-primary"
            title={`${articleCount} en esta sesión`}
          >
            {articleCount > 9 ? "9+" : articleCount}
          </div>
        )}
      </nav>

      {/* User + logout */}
      <div className={`shrink-0 border-t border-white/[0.07] ${collapsed ? "p-2" : "p-4"}`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
              title="Administrador"
            >
              A
            </span>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              type="button"
            >
              <FiLogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              A
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Administrador</p>
              <p className="truncate text-[11px] text-gray-500">auth@propulsa.com</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              type="button"
            >
              <FiLogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-white/[0.07] bg-background px-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-white"
          aria-label="Abrir menú"
          type="button"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <Image
          src="/assets/branding/logo.png"
          alt={APP_CONFIG.brandName}
          width={110}
          height={26}
          className="h-6 w-auto brightness-[10]"
        />
      </div>

      {/* ── Mobile backdrop ──────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* ── Sidebar panel ────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.07] bg-background transition-[width,transform] duration-300 ease-in-out lg:static lg:z-auto lg:shrink-0 lg:translate-x-0 ${
          mobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[4.25rem]" : "lg:w-60"} max-lg:w-64`}
      >
        {/* Mobile close button */}
        <button
          onClick={closeMobile}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-white lg:hidden"
          aria-label="Cerrar menú"
          type="button"
        >
          <FiX className="h-4 w-4" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
