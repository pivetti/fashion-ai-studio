import type { PromptOption } from "@/types/prompt";

export const genderOptions: PromptOption[] = [
  { label: "Feminino", value: "female" },
  { label: "Masculino", value: "male" },
  { label: "Neutro", value: "androgynous" },
];

export const skinToneOptions: PromptOption[] = [
  { label: "Clara", value: "fair skin tone" },
  { label: "Media", value: "medium skin tone" },
  { label: "Morena", value: "olive skin tone" },
  { label: "Negra", value: "deep skin tone" },
];

export const hairColorOptions: PromptOption[] = [
  { label: "Preto", value: "black hair" },
  { label: "Castanho", value: "brown hair" },
  { label: "Loiro", value: "blonde hair" },
  { label: "Ruivo", value: "red hair" },
  { label: "Grisalho", value: "silver-gray hair" },
];

export const hairStyleOptions: PromptOption[] = [
  { label: "Liso", value: "straight hair" },
  { label: "Ondulado", value: "wavy hair" },
  { label: "Cacheado", value: "curly hair" },
  { label: "Coque", value: "sleek bun hairstyle" },
  { label: "Curto", value: "short styled hair" },
];

export const eyeColorOptions: PromptOption[] = [
  { label: "Castanhos", value: "brown eyes" },
  { label: "Azuis", value: "blue eyes" },
  { label: "Verdes", value: "green eyes" },
  { label: "Mel", value: "hazel eyes" },
];

export const bodyTypeOptions: PromptOption[] = [
  { label: "Slim", value: "slim body type" },
  { label: "Atletico", value: "athletic body type" },
  { label: "Curvy", value: "curvy body type" },
  { label: "Plus size", value: "plus-size body type" },
  { label: "Regular", value: "regular body type" },
];
