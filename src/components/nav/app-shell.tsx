"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // La sesión corre a pantalla completa, sin cromo de navegación.
  const immersive = pathname.startsWith("/sesion");
  if (immersive) return <>{children}</>;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1400px]">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border px-4 py-6 md:flex">
        <div className="px-2">
          <BrandMark />
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-accent/12 text-ink font-medium"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Icon
                  className={cn("h-[18px] w-[18px]", active ? "text-accent" : "")}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </aside>

      {/* Contenido */}
      <main className="min-w-0 flex-1 px-5 pb-28 pt-6 md:px-10 md:pb-10 md:pt-10">
        {children}
      </main>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-surface/90 px-1 py-1 backdrop-blur md:hidden">
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
