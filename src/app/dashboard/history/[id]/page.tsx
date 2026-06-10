import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PreviewFrame } from "@/components/ui/PreviewFrame";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

type GenerationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
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

export default async function GenerationDetailPage({
  params,
}: GenerationDetailPageProps) {
  const { id } = await params;
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);

  const generation = await prisma.generation.findFirst({
    where: {
      id,
      organizationId: data.organization.id,
    },
    include: {
      outputAsset: true,
    },
  });

  if (!generation) {
    notFound();
  }

  const imageUrl =
    generation.outputAsset?.publicUrl &&
    generation.outputAsset.mimeType?.startsWith("image/")
      ? generation.outputAsset.publicUrl
      : null;

  return (
    <DashboardShell
      activePath="/dashboard/history"
      credits={data.credits}
      organizationName={data.organization.name}
      subtitle="Campanha"
      title={`Campanha #${generation.id.slice(-5)}`}
    >
      <div className="mb-4 lg:hidden">
        <h2 className="font-display text-2xl font-semibold text-[#F4EBDD]">
          Campanha #{generation.id.slice(-5)}
        </h2>
        <p className="mt-1 text-sm text-[#A9A096]">
          Imagem, status e direcao.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.45fr)] xl:gap-6">
        <div className="space-y-4 xl:space-y-6">
          <Card className="p-0" variant="elevated">
            <div className="p-4 sm:p-6">
              <SectionTitle index="01">Imagem</SectionTitle>
            </div>
            <PreviewFrame className="aspect-[4/5] rounded-none border-x-0">
              {imageUrl ? (
                <Image
                  alt={generation.outputAsset?.fileName ?? "Campanha gerada"}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1280px) 56vw, 90vw"
                  src={imageUrl}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <Badge tone="neutral">Direcao sem imagem</Badge>
                  <p className="mt-4 max-w-md text-sm leading-6 text-[#A9A096]">
                    Briefing salvo sem arquivo de imagem.
                  </p>
                </div>
              )}
            </PreviewFrame>

            <div className="grid gap-2 p-4 sm:grid-cols-3 sm:p-5">
              {generation.outputAsset?.publicUrl ? (
                <Link
                  className={buttonClassName("primary")}
                  href={generation.outputAsset.publicUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Abrir imagem
                </Link>
              ) : null}
              <Link
                className={buttonClassName("secondary")}
                href="/dashboard/history"
              >
                Galeria
              </Link>
              <Link
                className={buttonClassName("secondary")}
                href="/dashboard/generate"
              >
                Criar novo
              </Link>
            </div>
          </Card>

          <Card variant="soft">
            <SectionTitle index="02">Producao</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone={getStatusTone(generation.status)}>
                {generation.status}
              </Badge>
              <Badge tone="neutral">{generation.provider ?? "OTHER"}</Badge>
              <Badge tone="neutral">{generation.model ?? "mock"}</Badge>
              <Badge tone="gold">{generation.creditsUsed} credito</Badge>
            </div>
            <div className="mt-5 grid gap-2 text-sm text-[#A9A096] sm:grid-cols-2">
              <p>
                Criada:{" "}
                <span className="text-[#F4EBDD]">
                  {formatDate(generation.createdAt)}
                </span>
              </p>
              <p>
                Finalizada:{" "}
                <span className="text-[#F4EBDD]">
                  {generation.completedAt
                    ? formatDate(generation.completedAt)
                    : "Pendente"}
                </span>
              </p>
            </div>
          </Card>

          {generation.errorMessage ? (
            <section className="rounded-[1.35rem] border border-red-400/30 bg-red-950/35 p-5 text-sm text-red-100">
              {generation.errorMessage}
            </section>
          ) : null}

          <Card as="details">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#F4EBDD]">
              Direcao fotografica
              <span className="text-xs text-[#C8A96E]">Abrir</span>
            </summary>
            <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-[#28241C] bg-[#15130F] p-4 font-sans text-sm leading-7 text-[#F4EBDD]">
              {generation.prompt}
            </pre>
          </Card>
        </div>

        <div className="space-y-4 xl:space-y-6">
          <Card as="details" variant="soft">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#F4EBDD]">
              Dados tecnicos
              <span className="text-xs text-[#C8A96E]">Abrir</span>
            </summary>
            <pre className="mt-4 max-h-[520px] overflow-auto rounded-2xl border border-[#28241C] bg-[#080807] p-4 text-xs leading-6 text-[#A9A096]">
              {JSON.stringify(generation.inputData, null, 2)}
            </pre>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
