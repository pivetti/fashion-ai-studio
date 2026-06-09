import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const navigation = [
  { label: "Studio", href: "/dashboard" },
  { label: "Criar Editorial", href: "/dashboard/generate" },
  { label: "Galeria", href: "/dashboard/history" },
  { label: "Pecas", href: "/dashboard/assets" },
  { label: "Marca", href: "/dashboard/settings" },
  { label: "Creditos", href: "/dashboard/credits" },
];

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
    <main className="min-h-screen bg-[#080807] text-[#F4EBDD]">
      <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
        <aside className="border-b border-[#28241C] bg-[#0F0F0D] px-5 py-5 text-[#F4EBDD] lg:border-b-0 lg:border-r">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8A96E]">
              Betume Studio
            </p>
            <p className="mt-4 font-display text-2xl leading-7 text-[#F4EBDD]">
              Studio editorial
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
          <header className="flex flex-col gap-4 border-b border-[#28241C] bg-[#080807]/95 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
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

          <div className="flex-1 px-5 py-8 lg:px-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
