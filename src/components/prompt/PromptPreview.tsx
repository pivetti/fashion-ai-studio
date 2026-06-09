"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";

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
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionTitle index="05">Prompt gerado</SectionTitle>
          <h2 className="mt-5 font-display text-2xl font-semibold text-[#f0e6d0]">
            Preview
          </h2>
        </div>

        <Button
          disabled={!hasPrompt}
          onClick={copyPrompt}
          type="button"
          variant="secondary"
        >
          {copied ? "Copiado" : "Copiar prompt"}
        </Button>
      </div>

      <div className="mt-5 min-h-[320px] rounded-2xl border border-[#C8A96E]/20 bg-[#0d0d0d] p-4">
        {hasPrompt ? (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[#e0d5c5]">
            {prompt}
          </pre>
        ) : (
          <div className="flex min-h-[288px] items-center justify-center text-center text-sm leading-6 text-[#666]">
            Preencha o formulario e clique em Gerar Prompt para visualizar a
            direcao fotografica.
          </div>
        )}
      </div>
    </Card>
  );
}
