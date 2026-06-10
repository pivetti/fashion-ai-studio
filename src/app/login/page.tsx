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
    <main className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[#080807] px-4 py-6 text-[#F4EBDD] sm:py-10">
      <section className="w-full max-w-md">
        <div className="mb-6 text-center sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8A96E]">
            Betume Studio
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:mt-4 sm:text-5xl">
            Entre no studio
          </h1>
          <p className="mt-3 hidden text-sm leading-6 text-[#A9A096] sm:block">
            Crie campanhas visuais para sua loja sem ensaio fotografico.
          </p>
        </div>

        <Card as="form" action={loginAction} className="space-y-5" variant="soft">
          {errorMessage ? (
            <div className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#F4EBDD]" htmlFor="email">
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
              className="text-sm font-medium text-[#F4EBDD]"
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

        <p className="mt-6 text-center text-sm text-[#A9A096]">
          Ainda nao tem conta?{" "}
          <Link className="font-semibold text-[#E3C98A]" href="/register">
            Abrir studio
          </Link>
        </p>
      </section>
    </main>
  );
}
