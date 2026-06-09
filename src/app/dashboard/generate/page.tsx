import { AssetType } from "@prisma/client";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PromptForm } from "@/components/prompt/PromptForm";
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
      organizationName={data.organization.name}
      subtitle="Gerador de prompt"
      theme="dark"
      title="Gerar Imagem"
    >
      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <section className="rounded-lg border border-amber-300/20 bg-neutral-900 p-5 shadow-2xl shadow-black/20">
          <p className="text-sm font-medium text-amber-300">
            Prompt profissional de moda
          </p>
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-white">
            Monte uma direcao fotografica completa antes de conectar a geracao
            de imagem.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
            Esta etapa salva uma geracao mock no historico e desconta 1 credito,
            sem chamar API real e sem criar assets de imagem.
          </p>
        </section>

        <section className="rounded-lg border border-amber-300/20 bg-neutral-900 p-5 shadow-2xl shadow-black/20">
          <p className="text-sm text-neutral-400">Creditos disponiveis</p>
          <p className="mt-3 text-3xl font-semibold text-amber-300">
            {data.credits}
          </p>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            O mock consome 1 credito.
          </p>
        </section>
      </div>

      <section className="mb-6 rounded-lg border border-amber-300/20 bg-neutral-900 p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-amber-300">
              Referencia de roupa
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              Selecao de asset preparada para a proxima etapa
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Os assets enviados ja ficam disponiveis para futuramente alimentar
              a geracao real. Nesta versao, a selecao ainda nao entra no prompt
              nem cria imagens.
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <label className="space-y-2">
              <span className="text-sm font-medium text-amber-100">
                Asset de referencia
              </span>
              <select
                className="h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-neutral-500 outline-none"
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
            <Link
              className="mt-3 inline-flex text-sm font-medium text-amber-300 hover:text-amber-200"
              href="/dashboard/assets"
            >
              Enviar assets
            </Link>
          </div>
        </div>
      </section>

      <PromptForm />
    </DashboardShell>
  );
}
