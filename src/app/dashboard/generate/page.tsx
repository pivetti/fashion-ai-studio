import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PromptForm } from "@/components/prompt/PromptForm";
import { requireCurrentSession } from "@/lib/auth";
import { getDashboardContext } from "@/lib/dashboard";

export default async function GeneratePage() {
  const session = await requireCurrentSession();
  const data = await getDashboardContext(session.userId);

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

      <PromptForm />
    </DashboardShell>
  );
}
