"use server";

import { AssetType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFile, saveFile } from "@/lib/storage";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_MIME_TYPES = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_ASSET_TYPES = new Set<AssetType>([
  AssetType.CLOTHING_REFERENCE,
  AssetType.BRAND_LOGO,
  AssetType.STYLE_REFERENCE,
  AssetType.OTHER,
]);

function redirectWithAssetError(message: string): never {
  redirect(`/dashboard/assets?error=${encodeURIComponent(message)}`);
}

function redirectWithAssetSuccess(message: string): never {
  redirect(`/dashboard/assets?success=${encodeURIComponent(message)}`);
}

function getAssetType(formData: FormData) {
  const value = formData.get("type");

  if (typeof value !== "string") {
    redirectWithAssetError("Selecione um tipo de asset.");
  }

  if (!Object.values(AssetType).includes(value as AssetType)) {
    redirectWithAssetError("Tipo de asset invalido.");
  }

  const assetType = value as AssetType;

  if (!ALLOWED_ASSET_TYPES.has(assetType)) {
    redirectWithAssetError("Este tipo de asset ainda nao pode ser enviado.");
  }

  return assetType;
}

function getImageFile(formData: FormData) {
  const value = formData.get("file");

  if (!(value instanceof File) || value.size === 0) {
    redirectWithAssetError("Selecione uma imagem para enviar.");
  }

  if (!ACCEPTED_IMAGE_MIME_TYPES.has(value.type)) {
    redirectWithAssetError("Envie apenas imagens PNG, JPG, WebP ou GIF.");
  }

  if (value.size > MAX_FILE_SIZE_BYTES) {
    redirectWithAssetError("A imagem precisa ter no maximo 5MB.");
  }

  return value;
}

export async function uploadAsset(formData: FormData) {
  const session = await requireCurrentSession();
  const file = getImageFile(formData);
  const type = getAssetType(formData);

  const membership = await prisma.membership.findFirst({
    where: { userId: session.userId },
    select: { organizationId: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    redirectWithAssetError("Organizacao nao encontrada para este usuario.");
  }

  let savedFile: Awaited<ReturnType<typeof saveFile>> | null = null;

  try {
    savedFile = await saveFile({
      file,
      organizationId: membership.organizationId,
    });

    await prisma.asset.create({
      data: {
        organizationId: membership.organizationId,
        uploadedById: session.userId,
        type,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey: savedFile.storageKey,
        publicUrl: savedFile.publicUrl,
      },
    });
  } catch (error) {
    if (savedFile) {
      await deleteFile(savedFile.storageKey);
    }

    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel enviar o asset.";

    redirectWithAssetError(message);
  }

  revalidatePath("/dashboard/assets");
  redirectWithAssetSuccess("Asset enviado com sucesso.");
}
