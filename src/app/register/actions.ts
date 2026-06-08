"use server";

import {
  BillingStatus,
  CreditReason,
  MembershipRole,
  Prisma,
} from "@prisma/client";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

function getField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithError(message: string): never {
  redirect(`/register?error=${encodeURIComponent(message)}`);
}

async function generateUniqueOrganizationSlug(
  tx: Prisma.TransactionClient,
  organizationName: string,
) {
  const baseSlug = generateSlug(organizationName);
  let slug = baseSlug;

  for (let suffix = 2; suffix <= 100; suffix += 1) {
    const existingOrganization = await tx.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingOrganization) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function registerAction(formData: FormData) {
  const name = getField(formData, "name");
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");
  const organizationName = getField(formData, "organizationName");

  if (!name || !email || !password || !organizationName) {
    redirectWithError("Preencha todos os campos.");
  }

  if (password.length < 8) {
    redirectWithError("A senha precisa ter pelo menos 8 caracteres.");
  }

  try {
    const passwordHash = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
      const freePlan = await tx.plan.findUnique({
        where: { slug: "free" },
      });

      if (!freePlan) {
        throw new Error("Plano free nao encontrado. Rode a seed de planos primeiro.");
      }

      const organizationSlug = await generateUniqueOrganizationSlug(
        tx,
        organizationName,
      );

      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
        select: { id: true },
      });

      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          slug: organizationSlug,
        },
        select: { id: true },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: MembershipRole.OWNER,
        },
      });

      await tx.subscription.create({
        data: {
          organizationId: organization.id,
          planId: freePlan.id,
          status: BillingStatus.ACTIVE,
          planNameSnapshot: freePlan.name,
          planPriceCentsSnapshot: freePlan.monthlyPriceCents,
          planCreditsSnapshot: freePlan.monthlyCredits,
        },
      });

      await tx.creditLedger.create({
        data: {
          organizationId: organization.id,
          amount: freePlan.monthlyCredits,
          reason: CreditReason.PLAN_RENEWAL,
          description: "Creditos iniciais do plano Free/Teste.",
        },
      });

      return user;
    });

    await createSession(result.id);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirectWithError("Ja existe uma conta com este email.");
    }

    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel criar a conta.";

    redirectWithError(message);
  }

  redirect("/dashboard");
}
