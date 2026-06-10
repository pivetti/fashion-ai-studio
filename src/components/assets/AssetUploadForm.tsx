"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
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
        <span className="text-sm font-medium text-[#F4EBDD]">Tipo</span>
        <Select name="type" required>
          {assetTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#F4EBDD]">Imagem</span>
        <input
          accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
          className="block min-h-11 w-full rounded-2xl border border-[#28241C] bg-[#15130F] px-3 py-2 text-sm text-[#A9A096] file:mr-4 file:rounded-full file:border-0 file:bg-[#C8A96E] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#080807] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E]"
          name="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          required
          type="file"
        />
      </label>

      {clientError ? (
        <div className="rounded-2xl border border-amber-300/30 bg-amber-950/35 px-4 py-3 text-sm leading-6 text-amber-100">
          {clientError}
        </div>
      ) : null}

      <p className="text-xs leading-5 text-[#6F6A63]">
        Formatos aceitos: PNG, JPG, WebP ou GIF. Tamanho maximo:{" "}
        {MAX_ASSET_UPLOAD_MB}MB.
      </p>

      <Button className="w-full" disabled={Boolean(clientError)} type="submit">
        Enviar peca
      </Button>
    </form>
  );
}
