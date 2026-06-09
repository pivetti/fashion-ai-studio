"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import {
  createImageGeneration,
  createMockGeneration,
} from "@/app/dashboard/generate/actions";
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

type SelectFieldProps = {
  label: string;
  onChange: (value: string) => void;
  options: PromptOption[];
  value: string;
};

function SelectField({ label, onChange, options, value }: SelectFieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-amber-100">{label}</span>
      <select
        className="h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-neutral-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PromptForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setGenerationId("");
    setSuccessMessage("");
    setPrompt(buildFashionPrompt(input));
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
        return;
      }

      setGenerationId(result.generationId);
      setSuccessMessage(
        type === "image"
          ? "Imagem gerada e salva com sucesso."
          : "Geracao mock salva com sucesso.",
      );
      setPendingAction(null);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
      <form
        className="space-y-6 rounded-lg border border-amber-300/20 bg-neutral-900 p-5 shadow-2xl shadow-black/20"
        onSubmit={handleSubmit}
      >
        <div className="border-b border-white/10 pb-5">
          <p className="text-sm font-medium text-amber-300">
            Direcao de modelo
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Aparencia e styling
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
          <SelectField
            label="Pose"
            onChange={(value) => updateField("position", value)}
            options={positions}
            value={input.position}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
          <SelectField
            label="Iluminacao"
            onChange={(value) => updateField("lighting", value)}
            options={lightings}
            value={input.lighting}
          />
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-amber-100">
            Descricao da roupa
          </span>
          <textarea
            className="min-h-28 w-full resize-y rounded-md border border-white/10 bg-neutral-950 px-3 py-3 text-sm leading-6 text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            onChange={(event) =>
              updateField("clothingDesc", event.target.value)
            }
            placeholder="Ex: blazer oversized, calca de alfaiataria, bolsa estruturada..."
            value={input.clothingDesc}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-amber-100">
            Detalhes extras
          </span>
          <textarea
            className="min-h-24 w-full resize-y rounded-md border border-white/10 bg-neutral-950 px-3 py-3 text-sm leading-6 text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            onChange={(event) =>
              updateField("extraDetails", event.target.value)
            }
            placeholder="Ex: fundo minimalista, campanha premium, textura do tecido..."
            value={input.extraDetails}
          />
        </label>

        {errorMessage ? (
          <div className="rounded-md border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm leading-6 text-red-100">
            {errorMessage}
          </div>
        ) : null}

        {generationId ? (
          <div className="rounded-md border border-emerald-400/40 bg-emerald-950/40 px-4 py-3 text-sm leading-6 text-emerald-100">
            {successMessage}{" "}
            <Link
              className="font-semibold text-emerald-200 underline underline-offset-4"
              href={`/dashboard/history/${generationId}`}
            >
              Ver detalhe
            </Link>{" "}
            ou{" "}
            <Link
              className="font-semibold text-emerald-200 underline underline-offset-4"
              href="/dashboard/history"
            >
              abrir historico
            </Link>
            .
          </div>
        ) : null}

        <div className="grid gap-3 lg:grid-cols-3">
          <button
            className="h-12 rounded-md border border-amber-300/40 px-5 text-sm font-semibold text-amber-100 transition hover:bg-amber-300 hover:text-neutral-950"
            type="submit"
          >
            Gerar Prompt
          </button>

          <button
            className="h-12 rounded-md bg-amber-300 px-5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
            disabled={isPending || pendingAction !== null}
            onClick={() => handleGeneration("mock")}
            type="button"
          >
            {pendingAction === "mock" ? "Salvando..." : "Salvar/Gerar Mock"}
          </button>

          <button
            className="h-12 rounded-md bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
            disabled={isPending || pendingAction !== null}
            onClick={() => handleGeneration("image")}
            type="button"
          >
            {pendingAction === "image" ? "Gerando..." : "Gerar Imagem"}
          </button>
        </div>
      </form>

      <PromptPreview prompt={prompt} />
    </div>
  );
}
