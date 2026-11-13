"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/session/use-session-mutations";
import type { SessionView } from "@/features/session/types";

type AppShellProps = {
  session: SessionView;
  children: ReactNode;
};

const navigation = [
  { href: "/", label: "Tomar orden" },
  { href: "/ordenes", label: "Órdenes" },
  { href: "/corte", label: "Corte" },
  { href: "/equipo", label: "Equipo" },
] as const;

export function AppShell({ session, children }: AppShellProps) {
  const pathname = usePathname();
  const signOut = useSignOut();
  const [error, setError] = useState("");

  async function handleSignOut() {
    setError("");
    try {
      await signOut.mutateAsync();
    } catch {
      setError("No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="flex min-h-dvh min-w-0 flex-col bg-background">
      <a href="#contenido-principal" className="sr-only z-30 rounded-xl bg-ink px-5 py-3 font-semibold text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-4">
        Saltar al contenido
      </a>
      <header className="relative bg-surface px-4 pt-3 pb-4 sm:px-7">
        <div className="mx-auto flex w-full max-w-310 flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Image src="/logo-elotiza.png" alt="" width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" />
            <span className="text-base font-extrabold tracking-[-0.01em]">La Elotiza</span>
          </div>
          <nav aria-label="Secciones" className="order-3 flex w-full flex-wrap gap-1 rounded-3xl bg-surface-muted p-1 sm:order-2 sm:w-auto sm:rounded-full">
            {navigation.filter((item) => item.href !== "/equipo" || session.role === "encargado").map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:text-ink sm:px-4 ${active ? "bg-surface font-bold text-ink shadow-segment" : "text-muted"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex min-w-0 items-center gap-2 text-sm text-muted sm:order-3">
            <span className="min-w-0 truncate" title={session.name}>{session.name}</span>
            <Button variant="outline" onClick={handleSignOut} disabled={signOut.isPending} aria-label={`Salir de la sesión de ${session.name}`}>
              {signOut.isPending ? "Saliendo…" : "Salir"}
            </Button>
          </div>
        </div>
        {error && <p role="alert" className="mx-auto mt-2 max-w-310 text-sm text-danger">{error}</p>}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 grid h-1 grid-cols-3">
          <span className="bg-brand" /><span className="bg-elote" /><span className="bg-maize" />
        </div>
      </header>
      <main id="contenido-principal" tabIndex={-1} className="mx-auto w-full max-w-310 flex-1 px-4 py-6 sm:px-7 sm:py-8">
        {children}
      </main>
    </div>
  );
}
