"use server";

import {
  AssetType,
  GenerationStatus,
  ImageProvider,
  type Prisma,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireCurrentSession } from "@/lib/auth";
import {
  consumeCreditsForClient,
  ensureHasCredits,
  ensureHasCreditsForClient,
  InsufficientCreditsError,
} from "@/lib/credits";
import {
  generateImage,
  getConfiguredImageProvider,
  type ImageProviderName,
} from "@/lib/image-provider";
import { prisma } from "@/lib/prisma";
import { buildFashionPrompt } from "@/lib/prompt-builder";
import { deleteFile, saveBuffer } from "@/lib/storage";
import type { FashionPromptInput } from "@/types/prompt";

type CreateMockGenerationResult =
  | {
      ok: true;
      generationId: string;
    }
  | {
      ok: false;
      error: string;
    };

function validatePromptInput(input: FashionPromptInput) {
  if (!input.clothingDesc.trim()) {
    throw new Error("Informe a descricao da roupa antes de gerar.");
  }

  if (input.age < 16 || input.height <= 0 || input.weight <= 0) {
    throw new Error("Revise idade, altura e peso antes de gerar.");
  }
}

export async function createMockGeneration(
  input: FashionPromptInput,
): Promise<CreateMockGenerationResult> {
  const session = await requireCurrentSession();

  try {
    validatePromptInput(input);

    const generationId = await prisma.$transaction(async (tx) => {
      const membership = await tx.membership.findFirst({
        where: { userId: session.userId },
        select: { organizationId: true },
        orderBy: { createdAt: "asc" },
      });

      if (!membership) {
        throw new Error("Organizacao nao encontrada para este usuario.");
      }

      await ensureHasCreditsForClient(tx, membership.organizationId, 1);

      const prompt = buildFashionPrompt(input);
      const generation = await tx.generation.create({
        data: {
          organizationId: membership.organizationId,
          createdById: session.userId,
          inputData: input as unknown as Prisma.InputJsonValue,
          prompt,
          status: GenerationStatus.COMPLETED,
          provider: ImageProvider.OTHER,
          model: "mock",
          creditsUsed: 1,
          completedAt: new Date(),
        },
        select: { id: true },
      });

      await consumeCreditsForClient(tx, {
        organizationId: membership.organizationId,
        amount: 1,
        referenceType: "Generation",
        referenceId: generation.id,
        description: "Geração de imagem mock",
      });

      return generation.id;
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/generate");
    revalidatePath("/dashboard/history");

    return { ok: true, generationId };
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return { ok: false, error: error.message };
    }

    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Nao foi possivel criar a geracao mock.",
    };
  }
}

function toImageProviderEnum(provider: ImageProviderName) {
  if (provider === "openai") {
    return ImageProvider.OPENAI;
  }

  if (provider === "gemini") {
    return ImageProvider.GEMINI;
  }

  return ImageProvider.OTHER;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Nao foi possivel criar a geracao de imagem.";
}

export async function createImageGeneration(
  input: FashionPromptInput,
): Promise<CreateMockGenerationResult> {
  const session = await requireCurrentSession();
  let generationId = "";
  let savedFile: Awaited<ReturnType<typeof saveBuffer>> | null = null;

  try {
    validatePromptInput(input);

    const membership = await prisma.membership.findFirst({
      where: { userId: session.userId },
      select: { organizationId: true },
      orderBy: { createdAt: "asc" },
    });

    if (!membership) {
      throw new Error("Organizacao nao encontrada para este usuario.");
    }

    await ensureHasCredits(membership.organizationId, 1);

    const prompt = buildFashionPrompt(input);
    const provider = getConfiguredImageProvider();
    const generation = await prisma.generation.create({
      data: {
        organizationId: membership.organizationId,
        createdById: session.userId,
        inputData: input as unknown as Prisma.InputJsonValue,
        prompt,
        status: GenerationStatus.PROCESSING,
        provider: toImageProviderEnum(provider),
        model: provider,
        creditsUsed: 0,
        startedAt: new Date(),
      },
      select: { id: true },
    });
    generationId = generation.id;

    const imageResult = await generateImage({
      prompt,
      provider,
      size: process.env.IMAGE_SIZE ?? "1024x1024",
    });

    savedFile = await saveBuffer({
      organizationId: membership.organizationId,
      buffer: imageResult.buffer,
      mimeType: imageResult.mimeType,
      fileName: `generation-${generation.id}`,
    });
    const outputFile = savedFile;

    await prisma.$transaction(async (tx) => {
      await ensureHasCreditsForClient(tx, membership.organizationId, 1);

      const asset = await tx.asset.create({
        data: {
          organizationId: membership.organizationId,
          uploadedById: session.userId,
          type: AssetType.GENERATED_IMAGE,
          fileName: `generation-${generation.id}`,
          mimeType: imageResult.mimeType,
          sizeBytes: imageResult.buffer.byteLength,
          storageKey: outputFile.storageKey,
          publicUrl: outputFile.publicUrl,
          metadata: imageResult.metadata as Prisma.InputJsonValue,
        },
        select: { id: true },
      });

      await tx.generation.update({
        where: { id: generation.id },
        data: {
          status: GenerationStatus.COMPLETED,
          outputAssetId: asset.id,
          provider: toImageProviderEnum(imageResult.provider),
          model: imageResult.model,
          creditsUsed: 1,
          completedAt: new Date(),
          errorMessage: null,
        },
      });

      await consumeCreditsForClient(tx, {
        organizationId: membership.organizationId,
        amount: 1,
        referenceType: "Generation",
        referenceId: generation.id,
        description: "Geracao de imagem",
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/generate");
    revalidatePath("/dashboard/history");

    return { ok: true, generationId };
  } catch (error) {
    if (savedFile) {
      await deleteFile(savedFile.storageKey);
    }

    if (generationId) {
      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: GenerationStatus.FAILED,
          errorMessage: getErrorMessage(error),
        },
      });
    }

    revalidatePath("/dashboard/generate");
    revalidatePath("/dashboard/history");

    if (error instanceof InsufficientCreditsError) {
      return { ok: false, error: error.message };
    }

    return {
      ok: false,
      error: getErrorMessage(error),
    };
  }
}
