"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PreviewFrame } from "@/components/ui/PreviewFrame";
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
    <Card className="xl:sticky xl:top-6 xl:self-start" variant="soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionTitle index="05">Direcao fotografica</SectionTitle>
          <h2 className="mt-5 font-display text-2xl font-semibold text-[#F4EBDD]">
            Preview editorial
          </h2>
        </div>

        <Button
          disabled={!hasPrompt}
          onClick={copyPrompt}
          type="button"
          variant="secondary"
        >
          {copied ? "Copiado" : "Copiar direcao"}
        </Button>
      </div>

      <PreviewFrame className="mt-5 min-h-[360px]" label="Brief">
        {hasPrompt ? (
          <pre className="whitespace-pre-wrap break-words p-4 font-sans text-sm leading-7 text-[#F4EBDD]">
            {prompt}
          </pre>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center p-6 text-center text-sm leading-6 text-[#6F6A63]">
            Complete as etapas e gere a direcao para visualizar o briefing da
            campanha.
          </div>
        )}
      </PreviewFrame>
    </Card>
  );
}
