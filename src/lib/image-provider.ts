export type ImageProviderName = "mock" | "openai" | "gemini";

type GenerateImageParams = {
  prompt: string;
  provider: ImageProviderName;
  referenceImageUrl?: string;
  size?: string;
};

type GenerateImageResult = {
  buffer: Buffer;
  mimeType: string;
  provider: ImageProviderName;
  model: string;
  metadata?: Record<string, unknown>;
};

type OpenAIImageResponse = {
  data?: Array<{
    b64_json?: string;
    revised_prompt?: string;
    url?: string;
  }>;
  error?: {
    message?: string;
  };
};

const MOCK_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";

export function getConfiguredImageProvider(): ImageProviderName {
  const provider = process.env.IMAGE_PROVIDER?.toLowerCase() ?? "mock";

  if (provider === "mock" || provider === "openai" || provider === "gemini") {
    return provider;
  }

  return "mock";
}

async function generateMockImage(
  params: GenerateImageParams,
): Promise<GenerateImageResult> {
  return {
    buffer: Buffer.from(MOCK_IMAGE_BASE64, "base64"),
    mimeType: "image/png",
    provider: "mock",
    model: "mock-placeholder",
    metadata: {
      promptPreview: params.prompt.slice(0, 240),
      size: params.size ?? "1024x1024",
    },
  };
}

async function generateOpenAIImage(
  params: GenerateImageParams,
): Promise<GenerateImageResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Configure OPENAI_API_KEY para usar o provider OpenAI.");
  }

  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
  const size = params.size ?? "1024x1024";
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: params.prompt,
      size,
      n: 1,
    }),
  });

  const responseJson = (await response.json()) as OpenAIImageResponse;

  if (!response.ok) {
    throw new Error(
      responseJson.error?.message ?? "A OpenAI nao conseguiu gerar a imagem.",
    );
  }

  const image = responseJson.data?.[0];

  if (!image) {
    throw new Error("A OpenAI nao retornou uma imagem.");
  }

  if (image.b64_json) {
    return {
      buffer: Buffer.from(image.b64_json, "base64"),
      mimeType: "image/png",
      provider: "openai",
      model,
      metadata: {
        revisedPrompt: image.revised_prompt,
        requestId: response.headers.get("x-request-id"),
        size,
      },
    };
  }

  if (image.url) {
    const imageResponse = await fetch(image.url);

    if (!imageResponse.ok) {
      throw new Error("Nao foi possivel baixar a imagem retornada pela OpenAI.");
    }

    return {
      buffer: Buffer.from(await imageResponse.arrayBuffer()),
      mimeType: imageResponse.headers.get("content-type") ?? "image/png",
      provider: "openai",
      model,
      metadata: {
        revisedPrompt: image.revised_prompt,
        requestId: response.headers.get("x-request-id"),
        size,
      },
    };
  }

  throw new Error("A OpenAI retornou uma imagem sem conteudo utilizavel.");
}

async function generateGeminiImage(
  params: GenerateImageParams,
): Promise<GenerateImageResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Configure GEMINI_API_KEY para usar o provider Gemini.");
  }

  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-image";
  const size = params.size ?? "1024x1024";

  throw new Error(
    `Provider Gemini ainda nao foi configurado para geracao de imagem no modelo ${model} (${size}).`,
  );
}

export async function generateImage(params: GenerateImageParams) {
  if (params.provider === "openai") {
    return generateOpenAIImage(params);
  }

  if (params.provider === "gemini") {
    return generateGeminiImage(params);
  }

  return generateMockImage(params);
}
