import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <AppShell>
      <h1 className="text-2xl leading-tight font-extrabold tracking-[-0.01em]">
        Punto de venta
      </h1>
      <Card
        as="section"
        aria-labelledby="welcome-title"
        className="mt-6 sm:p-10"
      >
        <div className="max-w-xl">
          <Badge tone="warm" className="mb-4">En preparación</Badge>
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
      </Card>
    </AppShell>
  );
}
