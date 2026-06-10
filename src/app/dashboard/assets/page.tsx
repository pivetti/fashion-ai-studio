import { AssetType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { AssetUploadForm } from "@/components/assets/AssetUploadForm";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PreviewFrame } from "@/components/ui/PreviewFrame";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";
import { uploadAsset } from "./actions";

type AssetsPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    success?: string | string[];
  }>;
};

const assetTypeLabels: Record<AssetType, string> = {
  [AssetType.CLOTHING_REFERENCE]: "Peça",
  [AssetType.BRAND_LOGO]: "Logo da marca",
  [AssetType.GENERATED_IMAGE]: "Imagem gerada",
  [AssetType.STYLE_REFERENCE]: "Referencia de estilo",
  [AssetType.OTHER]: "Outro",
};

const uploadAssetTypes = [
  {
    label: "Roupa / produto",
    value: AssetType.CLOTHING_REFERENCE,
  },
  {
    label: "Logo da marca",
    value: AssetType.BRAND_LOGO,
  },
  {
    label: "Referencia de estilo",
    value: AssetType.STYLE_REFERENCE,
  },
  {
    label: "Outro",
    value: AssetType.OTHER,
  },
];

function getMessage(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatBytes(bytes?: number | null) {
  if (!bytes) {
    return "-";
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AssetsPage({ searchParams }: AssetsPageProps) {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);
  const params = await searchParams;
  const errorMessage = getMessage(params.error);
  const successMessage = getMessage(params.success);

  const assets = await prisma.asset.findMany({
    where: { organizationId: data.organization.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      fileName: true,
      mimeType: true,
      sizeBytes: true,
      publicUrl: true,
      createdAt: true,
    },
  });

  return (
    <DashboardShell
      activePath="/dashboard/assets"
      credits={data.credits}
      organizationName={data.organization.name}
      subtitle="Biblioteca visual"
      title="Peças e Referencias"
    >
      <div className="space-y-4 xl:grid xl:grid-cols-[360px_1fr] xl:gap-6 xl:space-y-0">
        <Card as="details" className="xl:hidden" variant="elevated">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#F4EBDD]">
            Enviar peça
            <span className="text-xs text-[#C8A96E]">Abrir</span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-[#A9A096]">
            Suba produto, logo ou inspiracao visual.
          </p>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-950/35 px-4 py-3 text-sm leading-6 text-red-100">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-950/35 px-4 py-3 text-sm leading-6 text-emerald-100">
              {successMessage}
            </div>
          ) : null}

          <AssetUploadForm action={uploadAsset} assetTypes={uploadAssetTypes} />
        </Card>

        <Card className="hidden xl:block" variant="elevated">
          <SectionTitle index="01">Entrada de peca</SectionTitle>
          <h2 className="mt-5 font-display text-3xl font-semibold text-[#F4EBDD]">
            Enviar referencia
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#A9A096]">
            Suba produto, logo ou inspiracao visual para compor a biblioteca do
            studio.
          </p>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-950/35 px-4 py-3 text-sm leading-6 text-red-100">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-950/35 px-4 py-3 text-sm leading-6 text-emerald-100">
              {successMessage}
            </div>
          ) : null}

          <AssetUploadForm action={uploadAsset} assetTypes={uploadAssetTypes} />
        </Card>

        <Card className="p-0">
          <div className="p-4 sm:p-6">
            <SectionTitle index="02">Biblioteca do studio</SectionTitle>
            <h2 className="mt-4 font-display text-2xl font-semibold text-[#F4EBDD] sm:mt-5 sm:text-3xl">
              {assets.length} peça{assets.length === 1 ? "" : "s"}
            </h2>
            <p className="mt-3 text-sm text-[#A9A096]">
              Arquivos de campanha, produto e marca para reutilizar nas
              imagens.
            </p>
          </div>

          {assets.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 p-4 pt-0 min-[390px]:grid-cols-2 md:grid-cols-2 md:gap-5 md:p-6 md:pt-0 2xl:grid-cols-3">
              {assets.map((asset) => {
                const imageUrl =
                  asset.publicUrl && asset.mimeType?.startsWith("image/")
                    ? asset.publicUrl
                    : null;

                return (
                  <article
                    className="overflow-hidden rounded-2xl border border-[#28241C] bg-[#15130F]"
                    key={asset.id}
                  >
                    <PreviewFrame className="aspect-square rounded-b-none border-x-0 border-t-0">
                      {imageUrl ? (
                        <Image
                          alt={asset.fileName ?? "Peca"}
                          className="object-cover"
                          fill
                          sizes="(min-width: 1536px) 25vw, (min-width: 768px) 40vw, 90vw"
                          src={imageUrl}
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-sm text-[#6F6A63]">
                          Sem preview
                        </span>
                      )}
                    </PreviewFrame>

                    <div className="space-y-3 p-3 sm:p-4">
                      <div>
                        <Badge tone="neutral">{assetTypeLabels[asset.type]}</Badge>
                        <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-[#F4EBDD]">
                          {asset.fileName ?? "Arquivo sem nome"}
                        </h3>
                      </div>

                      <div className="hidden gap-2 text-xs text-[#6F6A63] sm:grid">
                        <p>Tamanho: {formatBytes(asset.sizeBytes)}</p>
                        <p>Upload: {formatDate(asset.createdAt)}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link
                          className={buttonClassName("secondary")}
                          href="/dashboard/generate"
                        >
                          Usar
                        </Link>
                        {asset.publicUrl ? (
                          <Link
                            className="text-center text-sm font-semibold text-[#C8A96E] transition hover:text-[#E3C98A]"
                            href={asset.publicUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Abrir imagem
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="px-6 pb-10">
              <EmptyState
                description="Envie uma foto de produto, logo ou referencia de estilo para iniciar a biblioteca."
                eyebrow="Biblioteca vazia"
                title="Nenhuma peça enviada"
              />
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
