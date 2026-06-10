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
      subtitle="Criar Imagens"
      theme="dark"
      title="Monte um editorial com peça, modelo, luz e enquadramento."
    > 

      <PromptForm referenceAssets={referenceAssets} />
    </DashboardShell>
  );
}
