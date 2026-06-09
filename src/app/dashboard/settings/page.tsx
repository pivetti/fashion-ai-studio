import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function SettingsPage() {
  return await DashboardPlaceholder({
    activePath: "/dashboard/settings",
    description:
      "Configuracoes da organizacao, membros e perfil de marca serao adicionadas nesta secao.",
    title: "Configuracoes",
  });
}
