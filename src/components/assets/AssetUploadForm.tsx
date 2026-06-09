"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_ASSET_UPLOAD_BYTES,
  MAX_ASSET_UPLOAD_MB,
} from "@/lib/asset-upload";

type AssetTypeOption = {
  label: string;
  value: string;
};

type AssetUploadFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  assetTypes: AssetTypeOption[];
};

const acceptedImageMimeTypeSet = new Set<string>(ACCEPTED_IMAGE_MIME_TYPES);

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file?: File | null) {
  if (!file) {
    return null;
  }

  if (!acceptedImageMimeTypeSet.has(file.type)) {
    return "Envie apenas imagens PNG, JPG, WebP ou GIF.";
  }

  if (file.size > MAX_ASSET_UPLOAD_BYTES) {
    return `Esta imagem tem ${formatBytes(file.size)}. Envie imagens de ate ${MAX_ASSET_UPLOAD_MB}MB para evitar falhas no upload.`;
  }

  return null;
}

export function AssetUploadForm({ action, assetTypes }: AssetUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setClientError(validateFile(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const file = fileInputRef.current?.files?.[0];
    const message = validateFile(file);

    if (message) {
      event.preventDefault();
      setClientError(message);
      fileInputRef.current?.focus();
    }
  }

  return (
    <form
      action={action}
      className="mt-5 space-y-4"
      onSubmit={handleSubmit}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#e0d5c5]">Tipo</span>
        <select
          className="h-11 w-full rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-3 text-sm text-[#f0e6d0] outline-none transition focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/15"
          name="type"
          required
        >
          {assetTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#e0d5c5]">Imagem</span>
        <input
          accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
          className="block w-full rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-[#888] file:mr-4 file:rounded-lg file:border-0 file:bg-[#C8A96E] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
          name="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          required
          type="file"
        />
      </label>

      {clientError ? (
        <div className="rounded-xl border border-amber-300/30 bg-amber-950/40 px-4 py-3 text-sm leading-6 text-amber-100">
          {clientError}
        </div>
      ) : null}

      <p className="text-xs leading-5 text-[#666]">
        Formatos aceitos: PNG, JPG, WebP ou GIF. Tamanho maximo:{" "}
        {MAX_ASSET_UPLOAD_MB}MB.
      </p>

      <Button className="w-full" disabled={Boolean(clientError)} type="submit">
        Enviar asset
      </Button>
    </form>
  );
}
