import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getDashboardContext(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    redirect("/register?error=Organizacao nao encontrada para este usuario.");
  }

  const [credits, subscription] = await Promise.all([
    prisma.creditLedger.aggregate({
      where: { organizationId: membership.organizationId },
      _sum: { amount: true },
    }),
    prisma.subscription.findFirst({
      where: { organizationId: membership.organizationId },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    }),
  ]);

  return {
    organization: membership.organization,
    role: membership.role,
    credits: credits._sum.amount ?? 0,
    subscription,
  };
}
