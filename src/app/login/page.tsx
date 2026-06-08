import Link from "next/link";
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
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10 text-neutral-950">
      <section className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm font-medium text-teal-700">Fashion AI Studio</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Entrar na sua conta
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Acesse o painel da sua loja para acompanhar creditos e gerenciar sua
            operacao.
          </p>
        </div>

        <form
          action={loginAction}
          className="space-y-5 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
        >
          {errorMessage ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-md bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Ainda nao tem conta?{" "}
          <Link className="font-medium text-teal-700" href="/register">
            Criar cadastro
          </Link>
        </p>
      </section>
    </main>
  );
}
