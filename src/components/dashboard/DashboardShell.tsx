import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const navigation = [
  { label: "Studio", shortLabel: "Studio", href: "/dashboard" },
  { label: "Criar Imagens", shortLabel: "Criar", href: "/dashboard/generate" },
  { label: "Galeria", shortLabel: "Galeria", href: "/dashboard/history" },
  { label: "Pecas", shortLabel: "Pecas", href: "/dashboard/assets" },
  { label: "Marca", shortLabel: "Marca", href: "/dashboard/settings" },
  { label: "Creditos", shortLabel: "Creditos", href: "/dashboard/credits" },
];

const mobileNavigation = navigation.slice(0, 5);

type DashboardShellProps = {
  activePath: string;
  children: ReactNode;
  credits?: number;
  organizationName: string;
  subtitle?: string;
  theme?: "light" | "dark";
  title: string;
};

export function DashboardShell({
  activePath,
  children,
  credits,
  organizationName,
  subtitle = "Atelier digital",
  title,
}: DashboardShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080807] text-[#F4EBDD]">
      <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
        <aside className="hidden border-[#28241C] bg-[#0F0F0D] px-5 py-5 text-[#F4EBDD] lg:block lg:border-r">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8A96E]">
              Betume Studio
            </p>
            <p className="mt-4 font-display text-2xl leading-7 text-[#F4EBDD]">
              Studio de imagens
            </p>
            <p className="mt-2 truncate text-sm text-[#A9A096]">
              {organizationName}
            </p>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-1 text-sm lg:flex-col lg:overflow-visible lg:pb-0">
            {navigation.map((item) => {
              const active = item.href === activePath;

              return (
                <Link
                  key={item.href}
                  className={
                    active
                      ? "border-l border-[#C8A96E] bg-[#15130F] px-3 py-2.5 font-semibold text-[#F4EBDD]"
                      : "border-l border-transparent px-3 py-2.5 font-medium text-[#A9A096] transition hover:border-[#5C4724] hover:bg-[#15130F] hover:text-[#F4EBDD]"
                  }
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-40 flex min-h-[64px] items-center justify-between gap-3 border-b border-[#28241C] bg-[#080807]/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C8A96E]">
                Betume
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-[#F4EBDD]">
                {organizationName}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {typeof credits === "number" ? (
                <Badge tone="studio">{credits} cred.</Badge>
              ) : null}
              <details className="relative">
                <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full border border-[#28241C] bg-[#15130F] px-4 text-sm font-semibold text-[#F4EBDD] marker:hidden">
                  Menu
                </summary>
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#28241C] bg-[#0F0F0D] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
                  <Link
                    className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-[#A9A096] hover:bg-[#15130F] hover:text-[#F4EBDD]"
                    href="/dashboard/credits"
                  >
                    Creditos
                  </Link>
                  <form action={logoutAction}>
                    <button
                      className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-medium text-[#A9A096] hover:bg-[#15130F] hover:text-[#F4EBDD]"
                      type="submit"
                    >
                      Sair
                    </button>
                  </form>
                </div>
              </details>
            </div>
          </header>

          <header className="hidden flex-col gap-4 border-b border-[#28241C] bg-[#080807]/95 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:flex lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6F6A63]">
                {subtitle}
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#F4EBDD]">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {typeof credits === "number" ? (
                <Badge tone="studio">{credits} creditos</Badge>
              ) : null}
              <form action={logoutAction}>
                <Button type="submit" variant="secondary">
                  Sair
                </Button>
              </form>
            </div>
          </header>

          <div className="flex-1 px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-4 sm:px-5 lg:px-8 lg:py-8">
            {children}
          </div>

          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#28241C] bg-[#0F0F0D]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
            <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
              {mobileNavigation.map((item) => {
                const active = item.href === activePath;

                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "flex min-h-11 items-center justify-center rounded-2xl border border-[#5C4724] bg-[#1A1712] px-2 text-xs font-semibold text-[#E3C98A]"
                        : "flex min-h-11 items-center justify-center rounded-2xl border border-transparent px-2 text-xs font-semibold text-[#A9A096]"
                    }
                    href={item.href}
                    key={item.href}
                  >
                    {item.shortLabel}
                  </Link>
                );
              })}
            </div>
          </nav>
        </section>
      </div>
    </main>
  );
}
