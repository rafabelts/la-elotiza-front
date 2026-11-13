import Image from "next/image";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#contenido-principal"
        className="sr-only z-30 rounded-xl bg-ink px-5 py-3 font-semibold text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-4"
      >
        Saltar al contenido
      </a>

      <header className="relative bg-surface px-4 pt-3 pb-4 sm:px-7">
        <div className="mx-auto flex max-w-310 flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/logo-elotiza.png"
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full object-cover"
            />
            <span className="text-base font-extrabold tracking-[-0.01em]">
              La Elotiza
            </span>
          </div>
          <span className="ml-auto rounded-full bg-surface-muted px-3 py-2 text-xs font-semibold text-muted">
            Configuración inicial
          </span>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 grid h-1 grid-cols-3"
        >
          <span className="bg-brand" />
          <span className="bg-elote" />
          <span className="bg-maize" />
        </div>
      </header>

      <main
        id="contenido-principal"
        tabIndex={-1}
        className="mx-auto w-full max-w-310 flex-1 px-4 py-6 sm:px-7 sm:py-8"
      >
        {children}
      </main>
    </div>
  );
}
