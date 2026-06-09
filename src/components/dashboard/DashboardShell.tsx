import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const navigation = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Gerar Imagem", href: "/dashboard/generate" },
  { label: "Historico", href: "/dashboard/history" },
  { label: "Assets", href: "/dashboard/assets" },
  { label: "Creditos", href: "/dashboard/credits" },
  { label: "Configuracoes", href: "/dashboard/settings" },
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
  subtitle = "Organizacao atual",
  title,
}: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0e6d0]">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-[#1e1e1e] bg-[#0d0d0d] px-5 py-5 text-[#f0e6d0] lg:border-b-0 lg:border-r">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C8A96E]">
              Fashion AI Studio
            </p>
            <p className="mt-3 font-display text-2xl leading-7 text-[#f0e6d0]">
              {organizationName}
            </p>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto text-sm lg:flex-col lg:overflow-visible">
            {navigation.map((item) => {
              const active = item.href === activePath;

              return (
                <Link
                  key={item.href}
                  className={
                    active
                      ? "rounded-xl border border-[#C8A96E]/40 bg-[#C8A96E]/10 px-3 py-2 font-semibold text-[#C8A96E]"
                      : "rounded-xl border border-transparent px-3 py-2 font-medium text-[#888] transition hover:border-[#333] hover:bg-[#111] hover:text-[#f0e6d0]"
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
          <header className="flex flex-col gap-4 border-b border-[#1e1e1e] bg-[#0a0a0a]/95 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
                {subtitle}
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#f0e6d0]">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {typeof credits === "number" ? (
                <Badge>{credits} creditos</Badge>
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
