import { redirect } from "next/navigation";
import { requireCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "./actions";

async function getDashboardData(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    redirect("/register?error=Organizacao nao encontrada para este usuario.");
  }

  const [credits, subscription] = await Promise.all([
    prisma.creditLedger.aggregate({
      where: { organizationId: membership.organizationId },
      _sum: { amount: true },
    }),
    prisma.subscription.findFirst({
      where: { organizationId: membership.organizationId },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    }),
  ]);

  return {
    organization: membership.organization,
    role: membership.role,
    credits: credits._sum.amount ?? 0,
    subscription,
  };
}

export default async function DashboardPage() {
  const session = await requireCurrentSession();
  const data = await getDashboardData(session.userId);

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-neutral-200 bg-neutral-950 px-6 py-5 text-white lg:border-b-0 lg:border-r lg:border-neutral-800">
          <div>
            <p className="text-sm font-medium text-teal-300">
              Fashion AI Studio
            </p>
            <p className="mt-2 text-lg font-semibold leading-6">
              {data.organization.name}
            </p>
          </div>

          <nav className="mt-8 flex gap-2 text-sm lg:flex-col">
            <a
              className="rounded-md bg-white/10 px-3 py-2 font-medium"
              href="/dashboard"
            >
              Dashboard
            </a>
          </nav>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="flex flex-col gap-4 border-b border-neutral-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-500">Organizacao atual</p>
              <h1 className="text-2xl font-semibold tracking-tight">
                {data.organization.name}
              </h1>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="h-10 rounded-md border border-neutral-300 px-4 text-sm font-medium transition hover:bg-neutral-100"
              >
                Sair
              </button>
            </form>
          </header>

          <div className="px-6 py-8">
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
          </div>
        </section>
      </div>
    </main>
  );
}
