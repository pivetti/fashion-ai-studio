import { AssetType } from "@prisma/client";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PromptForm } from "@/components/prompt/PromptForm";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
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
      subtitle="Gerador de prompt"
      theme="dark"
      title="Gerar Imagem"
    >
      <div className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C8A96E]">
            Prompt profissional de moda
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-[#f0e6d0]">
            Monte uma direcao fotografica completa antes de conectar a geracao
            de imagem.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#888]">
            Gere o prompt, salve uma geracao mock ou acione o provider de imagem
            configurado. Quando a imagem real for gerada, ela tambem entra na
            biblioteca de assets.
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Creditos
          </p>
          <p className="mt-3 font-display text-5xl font-semibold text-[#C8A96E]">
            {data.credits}
          </p>
          <p className="mt-3 text-xs leading-5 text-[#666]">
            Mock e imagem consomem 1 credito.
          </p>
        </Card>
      </div>

      <Card className="mb-6">
        <SectionTitle index="00">Referencia de roupa</SectionTitle>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="mt-5 font-display text-2xl font-semibold text-[#f0e6d0]">
              Selecao de asset preparada para a proxima etapa
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#888]">
              Os assets enviados ja ficam disponiveis para futuramente alimentar
              a geracao real. Nesta versao, a selecao ainda nao entra no prompt
              nem cria imagens.
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#e0d5c5]">
                Asset de referencia
              </span>
              <select
                className="h-11 w-full rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-3 text-sm text-[#666] outline-none"
                disabled
              >
                {referenceAssets.length > 0 ? (
                  referenceAssets.map((asset) => (
                    <option key={asset.id}>
                      {asset.fileName ?? asset.type}
                    </option>
                  ))
                ) : (
                  <option>Nenhum asset de roupa ou estilo enviado</option>
                )}
              </select>
            </label>
            <div className="mt-3">
              <Badge tone="neutral">Preparado para versao futura</Badge>
            </div>
            <Link
              className="mt-3 inline-flex text-sm font-semibold text-[#C8A96E] hover:text-[#d8bd83]"
              href="/dashboard/assets"
            >
              Enviar assets
            </Link>
          </div>
        </div>
      </Card>

      <PromptForm />
    </DashboardShell>
  );
}
