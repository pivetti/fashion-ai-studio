import { CreditReason, PrismaClient, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreditClient = PrismaClient | Prisma.TransactionClient;

type ConsumeCreditsParams = {
  organizationId: string;
  amount: number;
  referenceType?: string;
  referenceId?: string;
  description?: string;
};

export class InsufficientCreditsError extends Error {
  constructor(balance: number, requiredCredits: number) {
    super(
      `Sua organizacao possui ${balance} credito(s), mas esta acao exige ${requiredCredits}.`,
    );
    this.name = "InsufficientCreditsError";
  }
}

export async function getCreditBalanceForClient(
  client: CreditClient,
  organizationId: string,
) {
  const result = await client.creditLedger.aggregate({
    where: { organizationId },
    _sum: { amount: true },
  });

  return result._sum.amount ?? 0;
}

export async function getCreditBalance(organizationId: string) {
  return getCreditBalanceForClient(prisma, organizationId);
}

export async function ensureHasCreditsForClient(
  client: CreditClient,
  organizationId: string,
  requiredCredits: number,
) {
  const balance = await getCreditBalanceForClient(client, organizationId);

  if (balance < requiredCredits) {
    throw new InsufficientCreditsError(balance, requiredCredits);
  }
}

export async function ensureHasCredits(
  organizationId: string,
  requiredCredits: number,
) {
  await ensureHasCreditsForClient(prisma, organizationId, requiredCredits);
}

export async function consumeCreditsForClient(
  client: CreditClient,
  params: ConsumeCreditsParams,
) {
  if (params.amount <= 0) {
    throw new Error("A quantidade de creditos consumidos precisa ser positiva.");
  }

  await client.creditLedger.create({
    data: {
      organizationId: params.organizationId,
      amount: -Math.abs(params.amount),
      reason: CreditReason.GENERATION,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      description: params.description,
    },
  });
}

export async function consumeCredits(params: ConsumeCreditsParams) {
  await consumeCreditsForClient(prisma, params);
}
