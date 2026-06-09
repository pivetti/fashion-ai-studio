import Link from "next/link";
import Image from "next/image";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PreviewFrame } from "@/components/ui/PreviewFrame";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

function getMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(date);
}

export default async function DashboardPage() {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);
  const monthStart = getMonthStart();
  const [
    generationCount,
    assetCount,
    monthGenerations,
    recentGenerations,
    recentAssets,
  ] = await Promise.all([
    prisma.generation.count({
      where: { organizationId: data.organization.id },
    }),
    prisma.asset.count({
      where: { organizationId: data.organization.id },
    }),
    prisma.generation.count({
      where: {
        organizationId: data.organization.id,
        createdAt: { gte: monthStart },
      },
    }),
    prisma.generation.findMany({
      where: { organizationId: data.organization.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        prompt: true,
        status: true,
        outputAsset: {
          select: {
            fileName: true,
            mimeType: true,
            publicUrl: true,
          },
        },
      },
      take: 3,
    }),
    prisma.asset.findMany({
      where: { organizationId: data.organization.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        fileName: true,
        mimeType: true,
        publicUrl: true,
        type: true,
      },
      take: 4,
    }),
  ]);

  return (
    <DashboardShell
      activePath="/dashboard"
      credits={data.credits}
      organizationName={data.organization.name}
      subtitle="Studio"
      title="Studio"
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="min-h-[320px] overflow-hidden" variant="elevated">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <Badge tone="gold">Campanhas visuais para moda</Badge>
              <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight text-[#F4EBDD] md:text-5xl">
                {data.organization.name}, seu estudio esta pronto.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A9A096]">
                Crie imagens de produto, organize referencias e transforme
                peças da loja em campanhas com direcao fotografica consistente.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={buttonClassName("primary")} href="/dashboard/generate">
                Criar nova imagem
              </Link>
              <Link className={buttonClassName("secondary")} href="/dashboard/history">
                Ver galeria
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <Card variant="soft">
            <p className="text-sm font-medium text-[#A9A096]">
              Creditos disponiveis
            </p>
            <p className="mt-3 font-display text-6xl font-semibold text-[#E3C98A]">
              {data.credits}
            </p>
            <p className="mt-2 text-sm text-[#6F6A63]">
              Cada imagem gerada consome 1 credito.
            </p>
          </Card>

          <Card>
            <p className="text-sm font-medium text-[#A9A096]">Uso do mes</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-4xl font-semibold text-[#F4EBDD]">
                  {monthGenerations}
                </p>
                <p className="mt-1 text-xs text-[#6F6A63]">imagens</p>
              </div>
              <div>
                <p className="font-display text-4xl font-semibold text-[#F4EBDD]">
                  {assetCount}
                </p>
                <p className="mt-1 text-xs text-[#6F6A63]">peças</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#28241C] pt-4 text-xs text-[#6F6A63]">
              <span>{data.subscription?.planNameSnapshot ?? "Sem plano"}</span>
              <Badge tone="neutral">{data.role}</Badge>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between gap-4 border-b border-[#28241C] p-6">
            <div>
              <p className="text-sm font-semibold text-[#F4EBDD]">
                Ultimas imagens
              </p>
              <p className="mt-1 text-sm text-[#6F6A63]">
                Imagens recentes do studio
              </p>
            </div>
            <Link className="text-sm font-semibold text-[#C8A96E]" href="/dashboard/history">
              Galeria
            </Link>
          </div>

          {recentGenerations.length > 0 ? (
            <div className="grid gap-4 p-6 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              {recentGenerations.map((generation) => {
                const imageUrl =
                  generation.outputAsset?.publicUrl &&
                  generation.outputAsset.mimeType?.startsWith("image/")
                    ? generation.outputAsset.publicUrl
                    : null;

                return (
                  <Link
                    className="group block"
                    href={`/dashboard/history/${generation.id}`}
                    key={generation.id}
                  >
                    <PreviewFrame className="aspect-[4/5]">
                      {imageUrl ? (
                        <Image
                          alt={generation.outputAsset?.fileName ?? "Campanha"}
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          fill
                          sizes="(min-width: 1280px) 24vw, 90vw"
                          src={imageUrl}
                        />
                      ) : (
                        <div className="flex h-full flex-col justify-between p-4">
                          <Badge tone="neutral">{generation.status}</Badge>
                          <p className="line-clamp-5 text-sm leading-6 text-[#A9A096]">
                            {generation.prompt}
                          </p>
                        </div>
                      )}
                    </PreviewFrame>
                    <p className="mt-3 text-xs text-[#6F6A63]">
                      {formatDate(generation.createdAt)}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                action={
                  <Link className={buttonClassName("primary")} href="/dashboard/generate">
                    Criar primeiro editorial
                  </Link>
                }
                description="Monte uma direcao fotografica e salve a primeira campanha da loja."
                title="Sua galeria ainda esta vazia"
              />
            </div>
          )}
        </Card>

        <Card className="p-0">
          <div className="flex items-center justify-between gap-4 border-b border-[#28241C] p-6">
            <div>
              <p className="text-sm font-semibold text-[#F4EBDD]">
                Peças recentes
              </p>
              <p className="mt-1 text-sm text-[#6F6A63]">
                Referencias prontas para a proxima imagem
              </p>
            </div>
            <Link className="text-sm font-semibold text-[#C8A96E]" href="/dashboard/assets">
              Peças
            </Link>
          </div>

          {recentAssets.length > 0 ? (
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {recentAssets.map((asset) => {
                const imageUrl =
                  asset.publicUrl && asset.mimeType?.startsWith("image/")
                    ? asset.publicUrl
                    : null;

                return (
                  <article
                    className="grid grid-cols-[88px_1fr] gap-4 rounded-2xl border border-[#28241C] bg-[#15130F] p-3"
                    key={asset.id}
                  >
                    <PreviewFrame className="relative aspect-square">
                      {imageUrl ? (
                        <Image
                          alt={asset.fileName ?? "Peca"}
                          className="object-cover"
                          fill
                          sizes="88px"
                          src={imageUrl}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#6F6A63]">
                          Sem preview
                        </div>
                      )}
                    </PreviewFrame>
                    <div className="min-w-0">
                      <Badge tone="neutral">{asset.type}</Badge>
                      <p className="mt-3 line-clamp-2 text-sm font-semibold text-[#F4EBDD]">
                        {asset.fileName ?? "Peca sem nome"}
                      </p>
                      <p className="mt-2 text-xs text-[#6F6A63]">
                        {formatDate(asset.createdAt)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                action={
                  <Link className={buttonClassName("secondary")} href="/dashboard/assets">
                    Enviar peças
                  </Link>
                }
                description="Adicione fotos de produto, logos e referencias de estilo para acelerar a criacao."
                eyebrow="Biblioteca vazia"
                title="Nenhuma peça enviada"
              />
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-5" variant="soft">
        <div className="grid gap-4 text-sm text-[#A9A096] md:grid-cols-3">
          <p>
            Responsavel:{" "}
            <span className="font-medium text-[#F4EBDD]">
              {session.user.name ?? session.user.email}
            </span>
          </p>
          <p>
            Campanhas salvas:{" "}
            <span className="font-medium text-[#F4EBDD]">
              {generationCount}
            </span>
          </p>
          <p>
            Plano:{" "}
            <span className="font-medium text-[#F4EBDD]">
              {data.subscription?.planNameSnapshot ?? "Sem plano"}
            </span>
          </p>
        </div>
      </Card>
    </DashboardShell>
  );
}
