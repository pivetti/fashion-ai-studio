import { AssetType } from "@prisma/client";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PromptForm } from "@/components/prompt/PromptForm";
import { Badge } from "@/components/ui/Badge";
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
      <header className="mb-4 flex flex-col gap-3 border-b border-[#28241C] pb-4 sm:flex-row sm:items-end sm:justify-between lg:mb-5 lg:pb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F4EBDD] sm:text-3xl">
            Criar Imagens
          </h2>
          <p className="mt-2 text-sm text-[#A9A096]">
            Monte um editorial com peça, modelo, luz e enquadramento.
          </p>
        </div>
        <Badge className="w-fit" tone="neutral">
          {data.credits} créditos · 1 por geração
        </Badge>
      </header>

      <PromptForm referenceAssets={referenceAssets} />
    </DashboardShell>
  );
}
