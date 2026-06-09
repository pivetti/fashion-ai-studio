import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";

export default async function DashboardPage() {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);

  return (
    <DashboardShell
      activePath="/dashboard"
      organizationName={data.organization.name}
      title={data.organization.name}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Creditos disponiveis</p>
          <p className="mt-3 text-3xl font-semibold">{data.credits}</p>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Plano atual</p>
          <p className="mt-3 text-3xl font-semibold">
            {data.subscription?.planNameSnapshot ?? "Sem plano"}
          </p>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Perfil</p>
          <p className="mt-3 text-3xl font-semibold">{data.role}</p>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold">Resumo</h2>
        <div className="mt-4 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
          <p>
            Usuario:{" "}
            <span className="font-medium text-neutral-950">
              {session.user.name ?? session.user.email}
            </span>
          </p>
          <p>
            Email:{" "}
            <span className="font-medium text-neutral-950">
              {session.user.email}
            </span>
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}
