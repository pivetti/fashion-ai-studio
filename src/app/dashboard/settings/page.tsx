import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function SettingsPage() {
  return await DashboardPlaceholder({
    activePath: "/dashboard/settings",
    description:
      "Perfil visual, membros e diretrizes de marca entram aqui nas proximas etapas.",
    title: "Marca",
  });
}
