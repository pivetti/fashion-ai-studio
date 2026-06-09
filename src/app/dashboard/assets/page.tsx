import { AssetType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { AssetUploadForm } from "@/components/assets/AssetUploadForm";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
  [AssetType.CLOTHING_REFERENCE]: "Roupa",
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
      title="Assets"
    >
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <SectionTitle index="01">Upload de imagem</SectionTitle>
          <h2 className="mt-5 font-display text-2xl font-semibold text-[#f0e6d0]">
            Adicionar asset
          </h2>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm leading-6 text-red-100">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-950/40 px-4 py-3 text-sm leading-6 text-emerald-100">
              {successMessage}
            </div>
          ) : null}

          <AssetUploadForm action={uploadAsset} assetTypes={uploadAssetTypes} />
        </Card>

        <Card className="p-0">
          <div className="p-6">
            <SectionTitle index="02">Biblioteca da organizacao</SectionTitle>
            <h2 className="mt-5 font-display text-2xl font-semibold text-[#f0e6d0]">
              {assets.length} asset{assets.length === 1 ? "" : "s"}
            </h2>
          </div>

          {assets.length > 0 ? (
            <div className="grid gap-5 p-6 pt-0 md:grid-cols-2 2xl:grid-cols-3">
              {assets.map((asset) => {
                const isImage = asset.mimeType?.startsWith("image/");

                return (
                  <article
                    className="overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d]"
                    key={asset.id}
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center bg-black">
                      {isImage && asset.publicUrl ? (
                        <Image
                          alt={asset.fileName ?? "Asset"}
                          className="object-cover"
                          fill
                          sizes="(min-width: 1536px) 25vw, (min-width: 768px) 40vw, 90vw"
                          src={asset.publicUrl}
                        />
                      ) : (
                        <span className="text-sm text-[#666]">
                          Sem preview
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 p-4">
                      <div>
                        <Badge tone="neutral">{assetTypeLabels[asset.type]}</Badge>
                        <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-[#f0e6d0]">
                          {asset.fileName ?? "Arquivo sem nome"}
                        </h3>
                      </div>

                      <div className="grid gap-2 text-xs text-[#666]">
                        <p>Tamanho: {formatBytes(asset.sizeBytes)}</p>
                        <p>Upload: {formatDate(asset.createdAt)}</p>
                      </div>

                      {asset.publicUrl ? (
                        <Link
                          className={buttonClassName("secondary")}
                          href={asset.publicUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Abrir imagem
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="px-6 pb-10 text-sm leading-6 text-[#888]">
              Nenhum asset enviado ainda. Adicione uma imagem de roupa, logo ou
              referencia para montar sua biblioteca.
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
