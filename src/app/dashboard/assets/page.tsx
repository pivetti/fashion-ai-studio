import { AssetType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
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
      organizationName={data.organization.name}
      title="Assets"
    >
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">
            Upload de imagem
          </p>
          <h2 className="mt-1 text-xl font-semibold">Adicionar asset</h2>

          {errorMessage ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <form
            action={uploadAsset}
            className="mt-5 space-y-4"
            encType="multipart/form-data"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium">Tipo</span>
              <select
                className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                name="type"
                required
              >
                <option value={AssetType.CLOTHING_REFERENCE}>
                  Roupa / produto
                </option>
                <option value={AssetType.BRAND_LOGO}>Logo da marca</option>
                <option value={AssetType.STYLE_REFERENCE}>
                  Referencia de estilo
                </option>
                <option value={AssetType.OTHER}>Outro</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Imagem</span>
              <input
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-neutral-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
                name="file"
                required
                type="file"
              />
            </label>

            <p className="text-xs leading-5 text-neutral-500">
              Formatos aceitos: PNG, JPG, WebP ou GIF. Tamanho maximo: 5MB.
            </p>

            <button
              className="h-11 w-full rounded-md bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
              type="submit"
            >
              Enviar asset
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-5 py-4">
            <p className="text-sm font-medium text-neutral-500">
              Biblioteca da organizacao
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {assets.length} asset{assets.length === 1 ? "" : "s"}
            </h2>
          </div>

          {assets.length > 0 ? (
            <div className="grid gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3">
              {assets.map((asset) => {
                const isImage = asset.mimeType?.startsWith("image/");

                return (
                  <article
                    className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
                    key={asset.id}
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center bg-neutral-200">
                      {isImage && asset.publicUrl ? (
                        <Image
                          alt={asset.fileName ?? "Asset"}
                          className="object-cover"
                          fill
                          sizes="(min-width: 1536px) 25vw, (min-width: 768px) 40vw, 90vw"
                          src={asset.publicUrl}
                        />
                      ) : (
                        <span className="text-sm text-neutral-500">
                          Sem preview
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 p-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                          {assetTypeLabels[asset.type]}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
                          {asset.fileName ?? "Arquivo sem nome"}
                        </h3>
                      </div>

                      <div className="grid gap-2 text-xs text-neutral-500">
                        <p>Tamanho: {formatBytes(asset.sizeBytes)}</p>
                        <p>Upload: {formatDate(asset.createdAt)}</p>
                      </div>

                      {asset.publicUrl ? (
                        <Link
                          className="inline-flex h-9 items-center rounded-md border border-neutral-300 px-3 text-sm font-medium transition hover:bg-white"
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
            <div className="px-5 py-10 text-sm leading-6 text-neutral-600">
              Nenhum asset enviado ainda. Adicione uma imagem de roupa, logo ou
              referencia para montar sua biblioteca.
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
