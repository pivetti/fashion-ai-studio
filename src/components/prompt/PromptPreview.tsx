"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PreviewFrame } from "@/components/ui/PreviewFrame";
import { SectionTitle } from "@/components/ui/SectionTitle";

type PromptPreviewProps = {
  compact?: boolean;
  prompt: string;
};

export function PromptPreview({ compact = false, prompt }: PromptPreviewProps) {
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
    <Card
      className={compact ? "p-4" : "xl:sticky xl:top-6 xl:self-start"}
      variant="soft"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          {compact ? null : (
            <SectionTitle index="05">Direcao fotografica</SectionTitle>
          )}
          <h2
            className={
              compact
                ? "font-display text-xl font-semibold text-[#F4EBDD]"
                : "mt-5 font-display text-2xl font-semibold text-[#F4EBDD]"
            }
          >
            Preview da imagem
          </h2>
        </div>

        <Button
          className={compact ? "px-4" : ""}
          disabled={!hasPrompt}
          onClick={copyPrompt}
          type="button"
          variant="secondary"
        >
          {copied ? "Copiado" : compact ? "Copiar" : "Copiar direcao"}
        </Button>
      </div>

      <PreviewFrame
        className={compact ? "mt-3 min-h-[132px]" : "mt-5 min-h-[360px]"}
        label="Brief"
      >
        {hasPrompt ? (
          <pre
            className={
              compact
                ? "max-h-32 overflow-auto whitespace-pre-wrap break-words p-3 font-sans text-xs leading-5 text-[#F4EBDD]"
                : "whitespace-pre-wrap break-words p-4 font-sans text-sm leading-7 text-[#F4EBDD]"
            }
          >
            {prompt}
          </pre>
        ) : (
          <div
            className={
              compact
                ? "flex min-h-[84px] items-center justify-center p-4 text-center text-xs leading-5 text-[#6F6A63]"
                : "flex min-h-[320px] items-center justify-center p-6 text-center text-sm leading-6 text-[#6F6A63]"
            }
          >
            Complete as etapas e gere a direcao para visualizar o briefing da
            campanha.
          </div>
        )}
      </PreviewFrame>
    </Card>
  );
}
