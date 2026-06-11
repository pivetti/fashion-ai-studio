import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET ?? "fashion-assets";

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL nao configurada.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY nao configurada.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

type SaveFileParams = {
  file: File;
  organizationId: string;
};

type SaveBufferParams = {
  buffer: Buffer;
  fileName?: string;
  mimeType: string;
  organizationId: string;
};

function getExtensionFromName(fileName?: string) {
  const match = fileName?.match(/\.[a-zA-Z0-9]+$/);
  const extension = match?.[0]?.toLowerCase();

  if (extension && extension.length <= 10) {
    return extension;
  }

  return "";
}

function getExtensionFromMimeType(mimeType: string) {
  const extensionByMimeType: Record<string, string> = {
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
  };

  return extensionByMimeType[mimeType] ?? "";
}

function getStorageKey(
  organizationId: string,
  mimeType: string,
  fileName?: string,
) {
  const extension =
    getExtensionFromName(fileName) || getExtensionFromMimeType(mimeType);

  return `${organizationId}/${randomUUID()}${extension}`;
}

export function getPublicUrl(storageKey: string) {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(storageKey);

  return data.publicUrl;
}

export async function saveFile({ file, organizationId }: SaveFileParams) {
  const storageKey = getStorageKey(organizationId, file.type, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(storageKey, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao enviar arquivo para o Supabase: ${error.message}`);
  }

  return {
    storageKey,
    publicUrl: getPublicUrl(storageKey),
  };
}

export async function saveBuffer({
  buffer,
  fileName,
  mimeType,
  organizationId,
}: SaveBufferParams) {
  const storageKey = getStorageKey(organizationId, mimeType, fileName);

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(storageKey, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao salvar imagem no Supabase: ${error.message}`);
  }

  return {
    storageKey,
    publicUrl: getPublicUrl(storageKey),
  };
}

export async function deleteFile(storageKey: string) {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([storageKey]);

  if (error) {
    throw new Error(`Erro ao remover arquivo do Supabase: ${error.message}`);
  }
}