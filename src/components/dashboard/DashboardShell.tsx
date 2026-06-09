import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/dashboard/actions";

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
  organizationName: string;
  subtitle?: string;
  theme?: "light" | "dark";
  title: string;
};

export function DashboardShell({
  activePath,
  children,
  organizationName,
  subtitle = "Organizacao atual",
  theme = "light",
  title,
}: DashboardShellProps) {
  const isDark = theme === "dark";

  return (
    <main
      className={
        isDark
          ? "min-h-screen bg-neutral-950 text-neutral-100"
          : "min-h-screen bg-neutral-100 text-neutral-950"
      }
    >
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-amber-400/15 bg-neutral-950 px-6 py-5 text-white lg:border-b-0 lg:border-r">
          <div>
            <p className="text-sm font-medium text-amber-300">
              Fashion AI Studio
            </p>
            <p className="mt-2 text-lg font-semibold leading-6">
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
                      ? "rounded-md bg-amber-300 px-3 py-2 font-medium text-neutral-950"
                      : "rounded-md px-3 py-2 font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
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
          <header
            className={
              isDark
                ? "flex flex-col gap-4 border-b border-amber-400/15 bg-neutral-950/90 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                : "flex flex-col gap-4 border-b border-neutral-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
            }
          >
            <div>
              <p
                className={
                  isDark ? "text-sm text-amber-200/70" : "text-sm text-neutral-500"
                }
              >
                {subtitle}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className={
                  isDark
                    ? "h-10 rounded-md border border-amber-300/30 px-4 text-sm font-medium text-amber-100 transition hover:bg-amber-300 hover:text-neutral-950"
                    : "h-10 rounded-md border border-neutral-300 px-4 text-sm font-medium transition hover:bg-neutral-100"
                }
              >
                Sair
              </button>
            </form>
          </header>

          <div className="flex-1 px-6 py-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
