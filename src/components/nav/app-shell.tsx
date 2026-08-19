"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  Dumbbell,
  RefreshCw,
  TriangleAlert,
  FileCheck2,
  ChartLine,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { SoundToggle } from "./sound-toggle";
import { BrandMark } from "./brand-mark";

type NavItem = { href: string; label: string; icon: React.ElementType };

const NAV: NavItem[] = [
  { href: "/", label: "Hoy", icon: Home },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/practica", label: "Práctica", icon: Dumbbell },
  { href: "/repasos", label: "Repasos", icon: RefreshCw },
  { href: "/errores", label: "Errores", icon: TriangleAlert },
  { href: "/simulacros", label: "Simulacros", icon: FileCheck2 },
  { href: "/progreso", label: "Progreso", icon: ChartLine },
  { href: "/perfil", label: "Perfil", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/* Estado de colapso de la sidebar (persistido). */
const sidebarListeners = new Set<() => void>();
function getCollapsed() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("rm-sidebar") === "collapsed";
  } catch {
    return false;
  }
}
function toggleCollapsed() {
  try {
    localStorage.setItem("rm-sidebar", getCollapsed() ? "expanded" : "collapsed");
  } catch {
    /* almacenamiento no disponible */
  }
  sidebarListeners.forEach((l) => l());
}
function useCollapsed() {
  return useSyncExternalStore(
    (cb) => {
      sidebarListeners.add(cb);
      return () => sidebarListeners.delete(cb);
    },
    getCollapsed,
    () => false,
  );
}

const MOBILE_PRIMARY = NAV.slice(0, 5);
const MOBILE_MORE = NAV.slice(5); // Simulacros, Progreso, Perfil

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useCollapsed();
  const [moreOpen, setMoreOpen] = useState(false);

  // La sesión, el onboarding y los simulacros corren a pantalla completa.
  const immersive =
    pathname.startsWith("/sesion") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/simulacros/rendir");
  if (immersive) return <>{children}</>;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1500px]">
      {/* Sidebar desktop */}
      <aside
        className={cn(
          "sticky top-0 z-30 hidden h-dvh shrink-0 flex-col border-r border-border bg-surface/40 py-6 transition-[width] duration-200 md:flex",
          collapsed ? "w-[76px] px-2" : "w-60 px-4",
        )}
      >
        {/* Encabezado: marca + botón de contraer/expandir integrado */}
        <div className={cn("flex items-center", collapsed ? "flex-col gap-3" : "justify-between px-2")}>
          <BrandMark compact={collapsed} />
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
            className="md-state grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "md-state group flex items-center gap-3 rounded-full py-2.5 text-sm transition-colors",
                  collapsed ? "justify-center px-0" : "px-4",
                  active
                    ? "bg-accent-soft font-bold text-on-primary-container"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Icon
                  className={cn("h-[18px] w-[18px] shrink-0", active ? "text-accent" : "")}
                  strokeWidth={active ? 2.4 : 1.9}
                />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        <div className={cn("flex flex-col", collapsed && "items-center")}>
          <SoundToggle compact={collapsed} />
          <ThemeToggle compact={collapsed} />
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-5 pb-28 pt-6 md:px-10 md:pb-10 md:pt-10">{children}</main>
        <footer className="hidden border-t border-border px-10 py-6 text-center text-xs text-ink-muted md:block">
          © {new Date().getFullYear()} Mateicos Matemáticos · Preparación para el ingreso a Ingeniería
          · Hecho con dedicación.
        </footer>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-surface/95 px-1 py-1 backdrop-blur md:hidden">
        {MOBILE_PRIMARY.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-md py-1.5 text-[10px]",
                active ? "text-accent" : "text-ink-muted",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-label="Más secciones"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 rounded-md py-1.5 text-[10px]",
            MOBILE_MORE.some((i) => isActive(pathname, i.href)) ? "text-accent" : "text-ink-muted",
          )}
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.8} />
          Más
        </button>
      </nav>

      {/* Hoja "Más" */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} aria-hidden />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-surface p-4 pb-7">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-surface-2" />
            <div className="grid grid-cols-3 gap-2">
              {MOBILE_MORE.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "md-state flex flex-col items-center gap-1.5 rounded-2xl p-4 text-xs font-semibold",
                      active ? "bg-accent-soft text-on-primary-container" : "text-ink-muted hover:bg-surface-2",
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={active ? 2.2 : 1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
