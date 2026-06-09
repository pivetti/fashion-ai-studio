import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function HistoryPage() {
  return await DashboardPlaceholder({
    activePath: "/dashboard/history",
    description:
      "O historico de prompts e geracoes sera conectado quando o modulo de imagens estiver pronto.",
    title: "Historico",
  });
}
