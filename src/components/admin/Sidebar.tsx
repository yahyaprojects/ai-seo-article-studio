"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiBookOpen,
  FiExternalLink,
  FiLogOut,
  FiMenu,
  FiX,
  FiZap,
} from "react-icons/fi";

import { APP_CONFIG } from "@/lib/constants";
import { useArticleStore } from "@/stores/useArticleStore";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  exact?: boolean;
  external?: boolean;
  badge?: number;
}

/* ─── Single nav item ─────────────────────────────────────────────────────── */

function NavLink({
  href,
  icon: Icon,
  label,
  exact,
  external,
  badge,
  onNavigate,
}: NavItem & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  const cls = isActive
    ? "bg-primary/10 text-primary"
    : "text-gray-400 hover:text-white hover:bg-white/5";

  const inner = (
    <span
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${cls}`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary/15 px-1.5 text-[11px] font-semibold text-primary">
          {badge}
        </span>
      )}
      {external && <FiExternalLink className="h-3 w-3 opacity-40" />}
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onNavigate}>
      {inner}
    </Link>
  );
}

/* ─── Main Sidebar component ──────────────────────────────────────────────── */

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const articleCount = useArticleStore((state) => state.articles.length);

  const navItems: NavItem[] = [
    { href: "/admin", icon: FiZap, label: "Generar artículo", exact: true },
    {
      href: "/admin/articles",
      icon: FiBookOpen,
      label: "Artículos",
      exact: false,
      badge: articleCount,
    },
    {
      href: "/preview",
      icon: FiExternalLink,
      label: "Vista Blog",
      external: true,
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
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.07] px-5">
        <Image
          src="/assets/branding/logo.png"
          alt={APP_CONFIG.brandName}
          width={130}
          height={30}
          priority
          className="h-7 w-auto brightness-[10]"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
          Panel
        </p>
        <ul className="grid gap-0.5">
          {navItems.map((item) => (
            <li key={item.href + item.label}>
              <NavLink {...item} onNavigate={closeMobile} />
            </li>
          ))}
        </ul>

        {/* Session stats */}
        {articleCount > 0 && (
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
      </nav>

      {/* User + logout */}
      <div className="shrink-0 border-t border-white/[0.07] p-4">
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
          >
            <FiLogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-white/[0.07] bg-[#0d0d11] px-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-white"
          aria-label="Abrir menú"
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.07] bg-[#0d0d11] transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-60 lg:shrink-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <button
          onClick={closeMobile}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-white lg:hidden"
          aria-label="Cerrar menú"
        >
          <FiX className="h-4 w-4" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
