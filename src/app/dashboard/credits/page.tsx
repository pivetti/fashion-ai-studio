import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function CreditsPage() {
  return await DashboardPlaceholder({
    activePath: "/dashboard/credits",
    description:
      "Extrato, compra e consumo de creditos serao exibidos aqui quando o billing for implementado.",
    title: "Creditos",
  });
}
