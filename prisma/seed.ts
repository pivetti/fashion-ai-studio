import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const plans = [
  {
    name: "Free/Teste",
    slug: "free",
    monthlyPriceCents: 0,
    monthlyCredits: 10,
    maxMembers: 1,
    maxStorageMb: 100,
    active: true,
  },
  {
    name: "Basic",
    slug: "basic",
    monthlyPriceCents: 4900,
    monthlyCredits: 30,
    maxMembers: 2,
    maxStorageMb: 500,
    active: true,
  },
  {
    name: "Pro",
    slug: "pro",
    monthlyPriceCents: 7900,
    monthlyCredits: 100,
    maxMembers: 5,
    maxStorageMb: 2000,
    active: true,
  },
  {
    name: "Premium",
    slug: "premium",
    monthlyPriceCents: 14900,
    monthlyCredits: 250,
    maxMembers: 10,
    maxStorageMb: 5000,
    active: true,
  },
] as const;

async function main() {
  let prisma: PrismaClient | undefined;

  try {
    const databaseUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL ou DIRECT_URL precisa estar configurada para rodar a seed.");
    }

    const adapter = new PrismaNeon({ connectionString: databaseUrl });
    prisma = new PrismaClient({ adapter });

    for (const plan of plans) {
      const existingPlan = await prisma.plan.findUnique({
        where: { slug: plan.slug },
        select: { id: true },
      });

      const savedPlan = await prisma.plan.upsert({
        where: { slug: plan.slug },
        create: plan,
        update: {
          name: plan.name,
          monthlyPriceCents: plan.monthlyPriceCents,
          monthlyCredits: plan.monthlyCredits,
          maxMembers: plan.maxMembers,
          maxStorageMb: plan.maxStorageMb,
          active: plan.active,
        },
      });

      const action = existingPlan ? "atualizado" : "criado";
      console.log(`[seed] Plano ${action}: ${savedPlan.name} (${savedPlan.slug})`);
    }
  } catch (error) {
    console.error("[seed] Erro ao executar seed dos planos:", error);
    process.exitCode = 1;
  } finally {
    await prisma?.$disconnect();
  }
}

void main();
