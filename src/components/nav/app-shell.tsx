"use client";

import { useSyncExternalStore } from "react";
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
  ChevronLeft,
  ChevronRight,
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useCollapsed();

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
        {/* Chevron en la línea divisoria */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          className="md-state absolute -right-3 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-ink-muted shadow-card hover:text-ink"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className={cn(collapsed ? "flex justify-center" : "px-2")}>
          <BrandMark compact={collapsed} />
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
          © {new Date().getFullYear()} RiseMath · Preparación para el ingreso a Ingeniería · Hecho con
          dedicación.
        </footer>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-surface/95 px-1 py-1 backdrop-blur md:hidden">
        {NAV.slice(0, 5).map((item) => {
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
      </nav>
    </div>
  );
}
