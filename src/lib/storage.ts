import { randomUUID } from "crypto";
import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

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

function assertInsideUploadRoot(filePath: string) {
  const resolvedRoot = path.resolve(UPLOAD_ROOT);
  const resolvedPath = path.resolve(filePath);

  if (
    resolvedPath !== resolvedRoot &&
    !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new Error("Caminho de storage invalido.");
  }

  return resolvedPath;
}

function getExtensionFromName(fileName?: string) {
  const extension = path.extname(fileName ?? "").toLowerCase();

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

function getStorageKey(organizationId: string, mimeType: string, fileName?: string) {
  const extension =
    getExtensionFromName(fileName) || getExtensionFromMimeType(mimeType);

  return `${organizationId}/${randomUUID()}${extension}`;
}

function getExtension(file: File) {
  const extension = getExtensionFromName(file.name);

  if (extension) {
    return extension;
  }

  const extensionByMimeType: Record<string, string> = {
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  return extensionByMimeType[file.type] ?? "";
}

export function getPublicUrl(storageKey: string) {
  const normalizedKey = storageKey.replaceAll("\\", "/");
  return `/uploads/${normalizedKey}`;
}

export async function saveFile({ file, organizationId }: SaveFileParams) {
  const storageKey = `${organizationId}/${randomUUID()}${getExtension(file)}`;
  const targetPath = assertInsideUploadRoot(path.join(UPLOAD_ROOT, storageKey));
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, buffer);

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
  const targetPath = assertInsideUploadRoot(path.join(UPLOAD_ROOT, storageKey));

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, buffer);

  return {
    storageKey,
    publicUrl: getPublicUrl(storageKey),
  };
}

export async function deleteFile(storageKey: string) {
  const targetPath = assertInsideUploadRoot(path.join(UPLOAD_ROOT, storageKey));

  await rm(targetPath, { force: true });
}
