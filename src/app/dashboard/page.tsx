import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);
  const [generationCount, assetCount] = await Promise.all([
    prisma.generation.count({
      where: { organizationId: data.organization.id },
    }),
    prisma.asset.count({
      where: { organizationId: data.organization.id },
    }),
  ]);

  return (
    <DashboardShell
      activePath="/dashboard"
      credits={data.credits}
      organizationName={data.organization.name}
      title={data.organization.name}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Creditos
          </p>
          <p className="mt-4 font-display text-5xl font-semibold text-[#C8A96E]">
            {data.credits}
          </p>
          <p className="mt-3 text-sm text-[#666]">Saldo disponivel</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Plano atual
          </p>
          <p className="mt-4 font-display text-4xl font-semibold text-[#f0e6d0]">
            {data.subscription?.planNameSnapshot ?? "Sem plano"}
          </p>
          <p className="mt-3 text-sm text-[#666]">Assinatura ativa</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Geracoes
          </p>
          <p className="mt-4 font-display text-5xl font-semibold text-[#f0e6d0]">
            {generationCount}
          </p>
          <p className="mt-3 text-sm text-[#666]">Historico salvo</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Assets
          </p>
          <p className="mt-4 font-display text-5xl font-semibold text-[#f0e6d0]">
            {assetCount}
          </p>
          <p className="mt-3 text-sm text-[#666]">Biblioteca da loja</p>
        </Card>
      </div>

      <Card className="mt-6">
        <SectionTitle index="01">Resumo da operacao</SectionTitle>
        <div className="mt-5 grid gap-4 text-sm text-[#888] sm:grid-cols-2">
          <p>
            Usuario:{" "}
            <span className="font-medium text-[#f0e6d0]">
              {session.user.name ?? session.user.email}
            </span>
          </p>
          <p>
            Email:{" "}
            <span className="font-medium text-[#f0e6d0]">
              {session.user.email}
            </span>
          </p>
          <p>
            Perfil: <Badge>{data.role}</Badge>
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className={buttonClassName("primary")} href="/dashboard/generate">
            Gerar imagem
          </Link>
          <Link className={buttonClassName("secondary")} href="/dashboard/assets">
            Ver assets
          </Link>
        </div>
      </Card>
    </DashboardShell>
  );
}
