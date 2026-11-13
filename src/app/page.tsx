import { AppShell } from "@/components/app-shell";

export default function HomePage() {
  return (
    <AppShell>
      <h1 className="text-2xl leading-tight font-extrabold tracking-[-0.01em]">
        Punto de venta
      </h1>
      <section
        aria-labelledby="welcome-title"
        className="mt-6 rounded-card border border-line bg-surface p-6 sm:p-10"
      >
        <div className="max-w-xl">
          <p className="mb-4 inline-block rounded-full bg-brand-tint px-3 py-1.5 text-xs font-bold text-brand-deep">
            En preparación
          </p>
          <h2
            id="welcome-title"
            className="text-xl leading-snug font-extrabold tracking-[-0.01em]"
          >
            Bienvenido a La Elotiza
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Estamos preparando tu espacio de trabajo. Las funciones de venta
            aún no están disponibles.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
