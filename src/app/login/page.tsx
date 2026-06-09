import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { redirectAuthenticatedUser } from "@/lib/auth";
import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function getErrorMessage(error?: string | string[]) {
  return Array.isArray(error) ? error[0] : error;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectAuthenticatedUser();

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-10 text-[#f0e6d0]">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C8A96E]">
            Fashion AI Studio
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            Entrar na sua conta
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#888]">
            Acesse o painel da sua loja para acompanhar creditos e gerenciar sua
            operacao.
          </p>
        </div>

        <Card as="form" action={loginAction} className="space-y-5">
          {errorMessage ? (
            <div className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </div>
          ) : null}

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
              autoComplete="current-password"
              required
            />
          </div>

          <Button className="w-full" type="submit">
            Entrar
          </Button>
        </Card>

        <p className="mt-6 text-center text-sm text-[#888]">
          Ainda nao tem conta?{" "}
          <Link className="font-semibold text-[#C8A96E]" href="/register">
            Criar cadastro
          </Link>
        </p>
      </section>
    </main>
  );
}
