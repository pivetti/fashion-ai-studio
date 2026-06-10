import type { FashionPromptInput } from "@/types/prompt";

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function buildFashionPrompt(input: FashionPromptInput) {
  const clothing = cleanText(input.clothingDesc);
  const extraDetails = cleanText(input.extraDetails);

  const subject = [
    `${input.age}-year-old ${input.gender} fashion model`,
    `${input.height} cm tall`,
    `approximately ${input.weight} kg`,
    input.bodyType,
    input.skinTone,
    input.hairColor,
    input.hairStyle,
    input.eyeColor,
  ].join(", ");

  const promptParts = [
    `Professional high-end fashion image of a ${subject}.`,
    `The model is wearing ${clothing || "a premium contemporary outfit with refined tailoring and visible fabric texture"}.`,
    `Pose and composition: ${input.position}, full outfit visible, clean silhouette, balanced proportions, confident expression, hands natural, premium catalog framing.`,
    `Lighting: ${input.lighting}, realistic shadows, controlled highlights, accurate color reproduction, crisp textile detail.`,
    `Camera setup: shot on ${input.camera} with a ${input.lens}, shallow depth of field, sharp focus on the outfit and face, natural skin texture.`,
    `Styling direction: luxury fashion campaign, elegant studio production, polished commercial retouching, realistic proportions, no distorted anatomy, no extra limbs, no text, no watermark.`,
  ];

  if (extraDetails) {
    promptParts.push(`Additional creative details: ${extraDetails}.`);
  }

  return promptParts.join("\n\n");
}
