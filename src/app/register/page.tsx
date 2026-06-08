import Link from "next/link";
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
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10 text-neutral-950">
      <section className="w-full max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-teal-700">Fashion AI Studio</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Criar conta da loja
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            O cadastro cria seu usuario, sua organizacao e ativa o plano
            Free/Teste com os creditos iniciais.
          </p>
        </div>

        <form
          action={registerAction}
          className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          {errorMessage ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

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
              autoComplete="new-password"
              minLength={8}
              required
              className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="organizationName">
              Empresa ou loja
            </label>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              autoComplete="organization"
              required
              className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="h-11 w-full rounded-md bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Criar conta
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Ja tem cadastro?{" "}
          <Link className="font-medium text-teal-700" href="/login">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
