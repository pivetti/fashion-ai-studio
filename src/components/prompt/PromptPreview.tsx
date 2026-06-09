"use client";

import { useState } from "react";

type PromptPreviewProps = {
  prompt: string;
};

export function PromptPreview({ prompt }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const hasPrompt = prompt.trim().length > 0;

  async function copyPrompt() {
    if (!hasPrompt) {
      return;
    }

    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-lg border border-amber-300/20 bg-neutral-900 p-5 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-amber-300">Prompt gerado</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Preview</h2>
        </div>

        <button
          className="h-10 rounded-md border border-amber-300/40 px-4 text-sm font-medium text-amber-100 transition hover:bg-amber-300 hover:text-neutral-950 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-neutral-500 disabled:hover:bg-transparent"
          disabled={!hasPrompt}
          onClick={copyPrompt}
          type="button"
        >
          {copied ? "Copiado" : "Copiar prompt"}
        </button>
      </div>

      <div className="mt-5 min-h-[320px] rounded-lg border border-white/10 bg-neutral-950 p-4">
        {hasPrompt ? (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-neutral-100">
            {prompt}
          </pre>
        ) : (
          <div className="flex min-h-[288px] items-center justify-center text-center text-sm leading-6 text-neutral-500">
            Preencha o formulario e clique em Gerar Prompt para visualizar a
            direcao fotografica.
          </div>
        )}
      </div>
    </section>
  );
}
