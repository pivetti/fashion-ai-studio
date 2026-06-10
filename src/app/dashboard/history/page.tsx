import Image from "next/image";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PreviewFrame } from "@/components/ui/PreviewFrame";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

type HistoryPageProps = {
  searchParams: Promise<{
    status?: string | string[];
  }>;
};

const statusFilters = [
  { href: "/dashboard/history", label: "Tudo", value: "ALL" },
  {
    href: "/dashboard/history?status=COMPLETED",
    label: "Concluidas",
    value: "COMPLETED",
  },
  {
    href: "/dashboard/history?status=PROCESSING",
    label: "Em producao",
    value: "PROCESSING",
  },
  {
    href: "/dashboard/history?status=FAILED",
    label: "Falhas",
    value: "FAILED",
  },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getPromptExcerpt(prompt: string) {
  return prompt.length > 150 ? `${prompt.slice(0, 150)}...` : prompt;
}

function getStatusTone(status: string): "red" | "green" | "gold" {
  if (status === "FAILED") {
    return "red";
  }

  if (status === "COMPLETED") {
    return "green";
  }

  return "gold";
}

function getSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);
  const params = await searchParams;
  const activeStatus = getSearchParam(params.status) ?? "ALL";

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

  const visibleGenerations =
    activeStatus === "ALL"
      ? generations
      : generations.filter((generation) => generation.status === activeStatus);

  return (
    <DashboardShell
      activePath="/dashboard/history"
      credits={data.credits}
      organizationName={data.organization.name}
      subtitle="Arquivo visual"
      title="Galeria"
    >
      <div className="mb-4 lg:hidden">
        <h2 className="font-display text-2xl font-semibold text-[#F4EBDD]">
          Galeria
        </h2>
        <p className="mt-1 text-sm text-[#A9A096]">
          Imagens, mocks e direcoes salvas.
        </p>
      </div>

      <div className="mb-5 overflow-x-auto pb-1">
        <div className="flex w-max gap-2">
          {statusFilters.map((filter) => {
            const active = activeStatus === filter.value;

            return (
              <Link
                className={
                  active
                    ? "flex min-h-11 items-center rounded-full border border-[#5C4724] bg-[#1A1712] px-4 text-sm font-semibold text-[#E3C98A]"
                    : "flex min-h-11 items-center rounded-full border border-[#28241C] bg-[#0F0F0D] px-4 text-sm font-semibold text-[#A9A096] transition hover:border-[#5C4724] hover:text-[#F4EBDD]"
                }
                href={filter.href}
                key={filter.value}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </div>

      {visibleGenerations.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:grid-cols-2 md:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleGenerations.map((generation) => {
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
                <Card className="h-full p-0 transition hover:border-[#5C4724]">
                  <PreviewFrame className="aspect-square rounded-b-none border-x-0 border-t-0 sm:aspect-[4/5]">
                    {imageUrl ? (
                      <Image
                        alt={generation.outputAsset?.fileName ?? "Campanha"}
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        fill
                        sizes="(min-width: 1536px) 22vw, (min-width: 1280px) 28vw, (min-width: 640px) 45vw, 90vw"
                        src={imageUrl}
                      />
                    ) : (
                      <div className="flex h-full flex-col justify-between p-3 sm:p-5">
                        <Badge tone="neutral">Rascunho</Badge>
                        <p className="line-clamp-4 text-xs leading-5 text-[#A9A096] sm:line-clamp-7 sm:text-sm sm:leading-6">
                          {getPromptExcerpt(generation.prompt)}
                        </p>
                      </div>
                    )}
                  </PreviewFrame>

                  <div className="space-y-3 p-3 sm:space-y-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Badge tone={getStatusTone(generation.status)}>
                        {generation.status}
                      </Badge>
                      <span className="text-xs text-[#6F6A63]">
                        {generation.creditsUsed} credito
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-semibold text-[#F4EBDD]">
                        Campanha #{generation.id.slice(-5)}
                      </h3>
                      <p className="mt-1 text-xs text-[#6F6A63]">
                        {formatDate(generation.createdAt)}
                      </p>
                    </div>

                    <p className="hidden line-clamp-3 text-sm leading-6 text-[#A9A096] sm:block">
                      {getPromptExcerpt(generation.prompt)}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#28241C] pt-4 text-xs text-[#6F6A63]">
                      <span>
                        {generation.provider ?? "OTHER"} /{" "}
                        {generation.model ?? "mock"}
                      </span>
                      <span className="font-semibold text-[#C8A96E]">
                        Abrir
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          action={
            <Link className={buttonClassName("primary")} href="/dashboard/generate">
              Criar imagem
            </Link>
          }
          description="Quando uma campanha for salva, ela aparece aqui com imagem, status e direcao fotografica."
          eyebrow="Galeria vazia"
          title="Nenhuma campanha encontrada"
        />
      )}
    </DashboardShell>
  );
}
