import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function CashClosePage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-[-0.01em]">Corte</h1>
      <Card as="section" aria-labelledby="cash-placeholder" className="mt-6">
        <Badge tone="warm">En preparación</Badge>
        <h2 id="cash-placeholder" className="mt-4 text-xl font-extrabold">Corte de caja</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">El corte de caja aún no está disponible.</p>
      </Card>
    </>
  );
}
