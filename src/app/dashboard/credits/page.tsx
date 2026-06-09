import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function CreditsPage() {
  return await DashboardPlaceholder({
    activePath: "/dashboard/credits",
    description:
      "Acompanhe futuramente o saldo do studio, consumo por campanha e pacotes adicionais.",
    title: "Creditos",
  });
}
