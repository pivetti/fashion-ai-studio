import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";

type DashboardPlaceholderProps = {
  activePath: string;
  description: string;
  title: string;
};

export async function DashboardPlaceholder({
  activePath,
  description,
  title,
}: DashboardPlaceholderProps) {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);

  return (
    <DashboardShell
      activePath={activePath}
      credits={data.credits}
      organizationName={data.organization.name}
      title={title}
    >
      <section className="rounded-2xl border border-[#1e1e1e] bg-[#111] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C8A96E]">
          Em breve
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-[#f0e6d0]">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#888]">
          {description}
        </p>
      </section>
    </DashboardShell>
  );
}
