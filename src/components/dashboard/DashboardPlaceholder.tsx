import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
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
      <EmptyState
        description={description}
        eyebrow="Em producao"
        title={title}
      />
    </DashboardShell>
  );
}
