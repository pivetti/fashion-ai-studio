import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
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
      organizationName={data.organization.name}
      title="Detalhe da geracao"
    >
      <div className="mb-4">
        <Link
          className="text-sm font-medium text-teal-700 hover:text-teal-900"
          href="/dashboard/history"
        >
          Voltar para o historico
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Status</p>
          <p className="mt-3 text-xl font-semibold">{generation.status}</p>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Provider/model</p>
          <p className="mt-3 text-xl font-semibold">
            {generation.provider ?? "OTHER"} / {generation.model ?? "mock"}
          </p>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Creditos usados</p>
          <p className="mt-3 text-xl font-semibold">
            {generation.creditsUsed}
          </p>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Criada em</p>
          <p className="mt-3 text-xl font-semibold">
            {formatDate(generation.createdAt)}
          </p>
        </section>
      </div>

      {generation.errorMessage ? (
        <section className="mt-4 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
          {generation.errorMessage}
        </section>
      ) : null}

      {generation.outputAsset?.publicUrl ? (
        <section className="mt-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold">Imagem gerada</h2>
            <Link
              className="inline-flex h-9 items-center rounded-md border border-neutral-300 px-3 text-sm font-medium transition hover:bg-neutral-100"
              href={generation.outputAsset.publicUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Abrir imagem
            </Link>
          </div>
          <div className="relative mt-4 aspect-square max-w-2xl overflow-hidden rounded-lg bg-neutral-100">
            <Image
              alt={generation.outputAsset.fileName ?? "Imagem gerada"}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 640px, 90vw"
              src={generation.outputAsset.publicUrl}
            />
          </div>
        </section>
      ) : null}

      <section className="mt-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold">Prompt completo</h2>
        <pre className="mt-4 whitespace-pre-wrap break-words rounded-md bg-neutral-950 p-4 font-sans text-sm leading-7 text-neutral-100">
          {generation.prompt}
        </pre>
      </section>

      <section className="mt-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold">Input data</h2>
        <pre className="mt-4 overflow-x-auto rounded-md bg-neutral-950 p-4 text-sm leading-7 text-neutral-100">
          {JSON.stringify(generation.inputData, null, 2)}
        </pre>
      </section>
    </DashboardShell>
  );
}
