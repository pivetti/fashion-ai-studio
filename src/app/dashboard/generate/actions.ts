"use server";

import { GenerationStatus, ImageProvider, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireCurrentSession } from "@/lib/auth";
import {
  consumeCreditsForClient,
  ensureHasCreditsForClient,
  InsufficientCreditsError,
} from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { buildFashionPrompt } from "@/lib/prompt-builder";
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
