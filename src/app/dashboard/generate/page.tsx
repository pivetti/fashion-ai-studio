import { AssetType } from "@prisma/client";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PromptForm } from "@/components/prompt/PromptForm";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Select } from "@/components/ui/Select";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

export default async function GeneratePage() {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);
  const referenceAssets = await prisma.asset.findMany({
    where: {
      organizationId: data.organization.id,
      type: {
        in: [AssetType.CLOTHING_REFERENCE, AssetType.STYLE_REFERENCE],
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fileName: true,
      type: true,
    },
    take: 5,
  });

  return (
    <DashboardShell
      activePath="/dashboard/generate"
      credits={data.credits}
      organizationName={data.organization.name}
      subtitle="Campanha"
      theme="dark"
      title="Criar Imagens"
    >
      <div className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <Card variant="elevated">
          <Badge tone="gold">Editorial Studio</Badge>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#F4EBDD]">
            Crie uma campanha com direcao fotografica clara.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A9A096]">
            Defina peça, casting, luz e lente. O motor de imagem entra no fim,
            quando o briefing estiver pronto.
          </p>
        </Card>

        <Card variant="soft">
          <p className="text-sm font-medium text-[#A9A096]">Creditos</p>
          <p className="mt-3 font-display text-5xl font-semibold text-[#E3C98A]">
            {data.credits}
          </p>
          <p className="mt-3 text-xs leading-5 text-[#6F6A63]">
            Mock e campanha gerada consomem 1 credito.
          </p>
        </Card>
      </div>

      <Card className="mb-6" variant="soft">
        <SectionTitle index="00">Pecas de referencia</SectionTitle>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="mt-5 font-display text-2xl font-semibold text-[#F4EBDD]">
              Biblioteca pronta para o proximo corte
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#A9A096]">
              A selecao abaixo ainda nao altera a campanha, mas organiza o fluxo
              para usar referencias nas proximas versoes.
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#F4EBDD]">
                Peça de referencia
              </span>
              <Select disabled>
                {referenceAssets.length > 0 ? (
                  referenceAssets.map((asset) => (
                    <option key={asset.id}>
                      {asset.fileName ?? asset.type}
                    </option>
                  ))
                ) : (
                  <option>Nenhuma peça ou referencia enviada</option>
                )}
              </Select>
            </label>
            <div className="mt-3">
              <Badge tone="neutral">Preparado para versao futura</Badge>
            </div>
            <Link
              className="mt-3 inline-flex text-sm font-semibold text-[#E3C98A] hover:text-[#C8A96E]"
              href="/dashboard/assets"
            >
              Enviar peças
            </Link>
          </div>
        </div>
      </Card>

      <PromptForm />
    </DashboardShell>
  );
}
