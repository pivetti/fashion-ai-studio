import Link from "next/link";
import Image from "next/image";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getPromptExcerpt(prompt: string) {
  return prompt.length > 180 ? `${prompt.slice(0, 180)}...` : prompt;
}

export default async function HistoryPage() {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);

  const generations = await prisma.generation.findMany({
    where: { organizationId: data.organization.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      status: true,
      provider: true,
      model: true,
      creditsUsed: true,
      prompt: true,
      outputAsset: {
        select: {
          fileName: true,
          mimeType: true,
          publicUrl: true,
        },
      },
    },
  });

  return (
    <DashboardShell
      activePath="/dashboard/history"
      organizationName={data.organization.name}
      title="Historico"
    >
      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <p className="text-sm font-medium text-neutral-500">
            Geracoes da organizacao
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            Historico de geracoes mock
          </h2>
        </div>

        {generations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Data</th>
                  <th className="px-5 py-3 font-semibold">Imagem</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Provider/model</th>
                  <th className="px-5 py-3 font-semibold">Creditos</th>
                  <th className="px-5 py-3 font-semibold">Prompt</th>
                  <th className="px-5 py-3 font-semibold">Detalhe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {generations.map((generation) => (
                  <tr key={generation.id} className="align-top">
                    <td className="px-5 py-4 text-neutral-600">
                      {formatDate(generation.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      {generation.outputAsset?.publicUrl &&
                      generation.outputAsset.mimeType?.startsWith("image/") ? (
                        <div className="relative h-14 w-14 overflow-hidden rounded-md bg-neutral-100">
                          <Image
                            alt={
                              generation.outputAsset.fileName ??
                              "Imagem gerada"
                            }
                            className="object-cover"
                            fill
                            sizes="56px"
                            src={generation.outputAsset.publicUrl}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        {generation.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {generation.provider ?? "OTHER"} /{" "}
                      {generation.model ?? "mock"}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {generation.creditsUsed}
                    </td>
                    <td className="max-w-sm px-5 py-4 leading-6 text-neutral-600">
                      {getPromptExcerpt(generation.prompt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        className="font-medium text-teal-700 hover:text-teal-900"
                        href={`/dashboard/history/${generation.id}`}
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-10 text-sm leading-6 text-neutral-600">
            Nenhuma geracao salva ainda. Use o gerador para criar o primeiro
            registro mock.
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
