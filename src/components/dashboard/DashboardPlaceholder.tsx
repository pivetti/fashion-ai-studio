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
      organizationName={data.organization.name}
      title={title}
    >
      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-neutral-500">Em breve</p>
        <h2 className="mt-2 text-xl font-semibold">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          {description}
        </p>
      </section>
    </DashboardShell>
  );
}
