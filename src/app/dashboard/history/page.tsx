import Link from "next/link";
import Image from "next/image";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
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
      credits={data.credits}
      organizationName={data.organization.name}
      title="Historico"
    >
      <Card className="p-0">
        <div className="p-6">
          <SectionTitle index="01">Geracoes da organizacao</SectionTitle>
          <h2 className="mt-5 font-display text-2xl font-semibold text-[#f0e6d0]">
            Historico de geracoes
          </h2>
        </div>

        {generations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead className="border-y border-[#1e1e1e] bg-[#0d0d0d] text-xs uppercase tracking-[0.18em] text-[#666]">
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
              <tbody className="divide-y divide-[#1e1e1e]">
                {generations.map((generation) => (
                  <tr key={generation.id} className="align-top">
                    <td className="px-5 py-4 text-[#888]">
                      {formatDate(generation.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      {generation.outputAsset?.publicUrl &&
                      generation.outputAsset.mimeType?.startsWith("image/") ? (
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0d0d0d]">
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
                        <span className="text-xs text-[#555]">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        tone={
                          generation.status === "FAILED"
                            ? "red"
                            : generation.status === "COMPLETED"
                              ? "green"
                              : "gold"
                        }
                      >
                        {generation.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-[#888]">
                      {generation.provider ?? "OTHER"} /{" "}
                      {generation.model ?? "mock"}
                    </td>
                    <td className="px-5 py-4 text-[#888]">
                      {generation.creditsUsed}
                    </td>
                    <td className="max-w-sm px-5 py-4 leading-6 text-[#888]">
                      {getPromptExcerpt(generation.prompt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        className="font-semibold text-[#C8A96E] hover:text-[#d8bd83]"
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
          <div className="px-6 pb-10 text-sm leading-6 text-[#888]">
            Nenhuma geracao salva ainda. Use o gerador para criar o primeiro
            registro mock.
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}
