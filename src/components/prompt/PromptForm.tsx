"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import {
  createImageGeneration,
  createMockGeneration,
} from "@/app/dashboard/generate/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Select } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { Textarea } from "@/components/ui/Textarea";
import {
  bodyTypeOptions,
  eyeColorOptions,
  genderOptions,
  hairColorOptions,
  hairStyleOptions,
  skinToneOptions,
} from "@/data/prompt/appearance";
import { cameras } from "@/data/prompt/cameras";
import { lenses } from "@/data/prompt/lenses";
import { lightings } from "@/data/prompt/lightings";
import { positions } from "@/data/prompt/positions";
import { buildFashionPrompt } from "@/lib/prompt-builder";
import type { FashionPromptInput, PromptOption } from "@/types/prompt";
import { OptionToggle } from "./OptionToggle";
import { PromptPreview } from "./PromptPreview";
import { SliderField } from "./SliderField";

const initialInput: FashionPromptInput = {
  gender: genderOptions[0].value,
  height: 172,
  weight: 62,
  age: 28,
  skinTone: skinToneOptions[1].value,
  hairColor: hairColorOptions[1].value,
  hairStyle: hairStyleOptions[1].value,
  eyeColor: eyeColorOptions[0].value,
  bodyType: bodyTypeOptions[4].value,
  camera: cameras[0].value,
  lens: lenses[1].value,
  position: positions[0].value,
  lighting: lightings[0].value,
  clothingDesc:
    "a tailored black blazer, satin top, high-waisted trousers, minimal gold accessories, polished luxury styling",
  extraDetails:
    "neutral studio background, premium ecommerce campaign, emphasis on fabric texture and garment fit",
};

const steps = [
  {
    description: "Roupa, produto e observacoes da campanha",
    label: "Peca",
  },
  {
    description: "Aparencia, medidas e styling do modelo",
    label: "Modelo",
  },
  {
    description: "Camera, lente, pose e luz",
    label: "Direcao",
  },
  {
    description: "Revise antes de salvar ou gerar",
    label: "Revisao",
  },
  {
    description: "Direcao, galeria e detalhe da campanha",
    label: "Resultado",
  },
];

type SelectFieldProps = {
  label: string;
  onChange: (value: string) => void;
  options: PromptOption[];
  value: string;
};

function SelectField({ label, onChange, options, value }: SelectFieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[#F4EBDD]">{label}</span>
      <Select
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  );
}

export function PromptForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState<FashionPromptInput>(initialInput);
  const [prompt, setPrompt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [generationId, setGenerationId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<"image" | "mock" | null>(
    null,
  );

  function updateField<T extends keyof FashionPromptInput>(
    field: T,
    value: FashionPromptInput[T],
  ) {
    setErrorMessage("");
    setSuccessMessage("");
    setInput((current) => ({ ...current, [field]: value }));
  }

  function buildAndShowPrompt() {
    setErrorMessage("");
    setGenerationId("");
    setSuccessMessage("");
    setPrompt(buildFashionPrompt(input));
    setCurrentStep(4);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    buildAndShowPrompt();
  }

  function handleGeneration(type: "image" | "mock") {
    setErrorMessage("");
    setGenerationId("");
    setSuccessMessage("");
    setPrompt(buildFashionPrompt(input));
    setPendingAction(type);

    startTransition(async () => {
      const result =
        type === "image"
          ? await createImageGeneration(input)
          : await createMockGeneration(input);

      if (!result.ok) {
        setErrorMessage(result.error);
        setPendingAction(null);
        setCurrentStep(3);
        return;
      }

      setGenerationId(result.generationId);
      setSuccessMessage(
        type === "image"
          ? "Campanha gerada e salva na galeria."
          : "Direcao mock salva na galeria.",
      );
      setPendingAction(null);
      setCurrentStep(4);
      router.refresh();
    });
  }

  function goToNextStep() {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function renderStepContent() {
    if (currentStep === 0) {
      return (
        <div className="space-y-5">
          <div>
            <SectionTitle index="01">Peca</SectionTitle>
            <h2 className="mt-5 font-display text-3xl font-semibold text-[#F4EBDD]">
              O que vai para a campanha?
            </h2>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#F4EBDD]">
              Roupa ou produto
            </span>
            <Textarea
              className="min-h-36"
              onChange={(event) =>
                updateField("clothingDesc", event.target.value)
              }
              placeholder="Ex: blazer oversized, calca de alfaiataria, bolsa estruturada..."
              value={input.clothingDesc}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#F4EBDD]">
              Diretrizes da campanha
            </span>
            <Textarea
              className="min-h-28"
              onChange={(event) =>
                updateField("extraDetails", event.target.value)
              }
              placeholder="Ex: fundo minimalista, campanha premium, textura do tecido..."
              value={input.extraDetails}
            />
          </label>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-5">
          <div>
            <SectionTitle index="02">Modelo</SectionTitle>
            <h2 className="mt-5 font-display text-3xl font-semibold text-[#F4EBDD]">
              Casting e proporcoes
            </h2>
          </div>

          <OptionToggle
            label="Genero"
            onChange={(value) => updateField("gender", value)}
            options={genderOptions}
            value={input.gender}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <SliderField
              label="Idade"
              max={70}
              min={16}
              onChange={(value) => updateField("age", value)}
              suffix=" anos"
              value={input.age}
            />
            <SliderField
              label="Altura"
              max={205}
              min={145}
              onChange={(value) => updateField("height", value)}
              suffix=" cm"
              value={input.height}
            />
            <SliderField
              label="Peso"
              max={130}
              min={40}
              onChange={(value) => updateField("weight", value)}
              suffix=" kg"
              value={input.weight}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Tom de pele"
              onChange={(value) => updateField("skinTone", value)}
              options={skinToneOptions}
              value={input.skinTone}
            />
            <SelectField
              label="Tipo fisico"
              onChange={(value) => updateField("bodyType", value)}
              options={bodyTypeOptions}
              value={input.bodyType}
            />
            <SelectField
              label="Cor do cabelo"
              onChange={(value) => updateField("hairColor", value)}
              options={hairColorOptions}
              value={input.hairColor}
            />
            <SelectField
              label="Estilo do cabelo"
              onChange={(value) => updateField("hairStyle", value)}
              options={hairStyleOptions}
              value={input.hairStyle}
            />
            <SelectField
              label="Cor dos olhos"
              onChange={(value) => updateField("eyeColor", value)}
              options={eyeColorOptions}
              value={input.eyeColor}
            />
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-5">
          <div>
            <SectionTitle index="03">Direcao</SectionTitle>
            <h2 className="mt-5 font-display text-3xl font-semibold text-[#F4EBDD]">
              Fotografia e luz
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Pose"
              onChange={(value) => updateField("position", value)}
              options={positions}
              value={input.position}
            />
            <SelectField
              label="Iluminacao"
              onChange={(value) => updateField("lighting", value)}
              options={lightings}
              value={input.lighting}
            />
            <SelectField
              label="Camera"
              onChange={(value) => updateField("camera", value)}
              options={cameras}
              value={input.camera}
            />
            <SelectField
              label="Lente"
              onChange={(value) => updateField("lens", value)}
              options={lenses}
              value={input.lens}
            />
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-5">
          <div>
            <SectionTitle index="04">Revisao</SectionTitle>
            <h2 className="mt-5 font-display text-3xl font-semibold text-[#F4EBDD]">
              Pronta para campanha
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#A9A096]">
              Gere a direcao fotografica, salve um rascunho mock ou envie para o
              provider configurado.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-[#A9A096] md:grid-cols-2">
            <div className="rounded-2xl border border-[#28241C] bg-[#15130F] p-4">
              <p className="text-xs text-[#6F6A63]">Peca</p>
              <p className="mt-2 line-clamp-3 text-[#F4EBDD]">
                {input.clothingDesc}
              </p>
            </div>
            <div className="rounded-2xl border border-[#28241C] bg-[#15130F] p-4">
              <p className="text-xs text-[#6F6A63]">Direcao</p>
              <p className="mt-2 text-[#F4EBDD]">
                {input.position} / {input.lighting}
              </p>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-400/40 bg-red-950/35 px-4 py-3 text-sm leading-6 text-red-100">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-3 lg:grid-cols-3">
            <Button type="submit" variant="secondary">
              Gerar direcao
            </Button>

            <Button
              disabled={isPending || pendingAction !== null}
              onClick={() => handleGeneration("mock")}
              type="button"
            >
              {pendingAction === "mock" ? "Salvando..." : "Salvar mock"}
            </Button>

            <Button
              disabled={isPending || pendingAction !== null}
              onClick={() => handleGeneration("image")}
              type="button"
            >
              {pendingAction === "image" ? "Gerando..." : "Gerar campanha"}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div>
          <SectionTitle index="05">Resultado</SectionTitle>
          <h2 className="mt-5 font-display text-3xl font-semibold text-[#F4EBDD]">
            Direcao pronta
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#A9A096]">
            Copie a direcao no painel ao lado ou abra a campanha salva na
            galeria.
          </p>
        </div>

        {generationId ? (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/30 px-4 py-3 text-sm leading-6 text-emerald-100">
            {successMessage}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#28241C] bg-[#15130F] px-4 py-3 text-sm leading-6 text-[#A9A096]">
            A direcao fotografica foi montada para revisao. Salve ou gere a
            campanha quando estiver pronta.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          {generationId ? (
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#E3C98A] via-[#C8A96E] to-[#8C6A32] px-5 py-2 text-sm font-semibold text-[#080807]"
              href={`/dashboard/history/${generationId}`}
            >
              Ver campanha
            </Link>
          ) : null}
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#28241C] bg-[#15130F] px-5 py-2 text-sm font-semibold text-[#F4EBDD]"
            href="/dashboard/history"
          >
            Abrir galeria
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_minmax(340px,0.82fr)]">
      <Card className="xl:sticky xl:top-6 xl:self-start" variant="soft">
        <SectionTitle eyebrow="Workspace">Criar Editorial</SectionTitle>
        <div className="mt-5">
          <Stepper
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            steps={steps}
          />
        </div>
      </Card>

      <Card as="form" className="space-y-7" onSubmit={handleSubmit}>
        {renderStepContent()}

        <div className="flex flex-col gap-3 border-t border-[#28241C] pt-5 sm:flex-row sm:justify-between">
          <Button
            disabled={currentStep === 0}
            onClick={goToPreviousStep}
            type="button"
            variant="ghost"
          >
            Voltar
          </Button>

          {currentStep < 3 ? (
            <Button onClick={goToNextStep} type="button" variant="secondary">
              Proxima etapa
            </Button>
          ) : currentStep === 4 ? (
            <Button
              onClick={() => setCurrentStep(3)}
              type="button"
              variant="secondary"
            >
              Revisar de novo
            </Button>
          ) : null}
        </div>
      </Card>

      <PromptPreview prompt={prompt} />
    </div>
  );
}
