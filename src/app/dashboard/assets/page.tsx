import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function AssetsPage() {
  return await DashboardPlaceholder({
    activePath: "/dashboard/assets",
    description:
      "A biblioteca de referencias, logos e imagens geradas sera organizada nesta area.",
    title: "Assets",
  });
}
