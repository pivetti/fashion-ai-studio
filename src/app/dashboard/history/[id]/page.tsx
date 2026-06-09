import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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

  return (
    <DashboardShell
      activePath="/dashboard/history"
      credits={data.credits}
      organizationName={data.organization.name}
      title="Detalhe da geracao"
    >
      <div className="mb-4">
        <Link
          className="text-sm font-semibold text-[#C8A96E] hover:text-[#d8bd83]"
          href="/dashboard/history"
        >
          Voltar para o historico
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Status
          </p>
          <div className="mt-4">
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
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Provider/model
          </p>
          <p className="mt-4 text-xl font-semibold text-[#f0e6d0]">
            {generation.provider ?? "OTHER"} / {generation.model ?? "mock"}
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Creditos usados
          </p>
          <p className="mt-4 font-display text-3xl font-semibold text-[#C8A96E]">
            {generation.creditsUsed}
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Criada em
          </p>
          <p className="mt-4 text-xl font-semibold text-[#f0e6d0]">
            {formatDate(generation.createdAt)}
          </p>
        </Card>
      </div>

      {generation.errorMessage ? (
        <section className="mt-4 rounded-2xl border border-red-400/30 bg-red-950/40 p-5 text-sm text-red-100">
          {generation.errorMessage}
        </section>
      ) : null}

      {generation.outputAsset?.publicUrl ? (
        <Card className="mt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle index="01">Imagem gerada</SectionTitle>
            <Link
              className={buttonClassName("secondary")}
              href={generation.outputAsset.publicUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Abrir imagem
            </Link>
          </div>
          <div className="relative mt-5 aspect-square max-w-2xl overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d]">
            <Image
              alt={generation.outputAsset.fileName ?? "Imagem gerada"}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 640px, 90vw"
              src={generation.outputAsset.publicUrl}
            />
          </div>
        </Card>
      ) : null}

      <Card className="mt-4">
        <SectionTitle index="02">Prompt completo</SectionTitle>
        <pre className="mt-5 whitespace-pre-wrap break-words rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] p-4 font-sans text-sm leading-7 text-[#e0d5c5]">
          {generation.prompt}
        </pre>
      </Card>

      <Card className="mt-4">
        <SectionTitle index="03">Input data</SectionTitle>
        <pre className="mt-5 overflow-x-auto rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] p-4 text-sm leading-7 text-[#e0d5c5]">
          {JSON.stringify(generation.inputData, null, 2)}
        </pre>
      </Card>
    </DashboardShell>
  );
}
