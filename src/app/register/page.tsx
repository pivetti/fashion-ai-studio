import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { redirectAuthenticatedUser } from "@/lib/auth";
import { registerAction } from "./actions";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function getErrorMessage(error?: string | string[]) {
  return Array.isArray(error) ? error[0] : error;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  await redirectAuthenticatedUser();

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-10 text-[#f0e6d0]">
      <section className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C8A96E]">
            Fashion AI Studio
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            Criar conta da loja
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#888]">
            O cadastro cria seu usuario, sua organizacao e ativa o plano
            Free/Teste com os creditos iniciais.
          </p>
        </div>

        <Card as="form" action={registerAction} className="grid gap-5 sm:grid-cols-2">
          {errorMessage ? (
            <div className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-100 sm:col-span-2">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e0d5c5]" htmlFor="name">
              Nome
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e0d5c5]" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#e0d5c5]"
              htmlFor="password"
            >
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#e0d5c5]"
              htmlFor="organizationName"
            >
              Empresa ou loja
            </label>
            <Input
              id="organizationName"
              name="organizationName"
              type="text"
              autoComplete="organization"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <Button className="w-full" type="submit">
              Criar conta
            </Button>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-[#888]">
          Ja tem cadastro?{" "}
          <Link className="font-semibold text-[#C8A96E]" href="/login">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
