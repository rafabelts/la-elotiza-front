import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-[-0.01em]">Órdenes</h1>
      <Card as="section" aria-labelledby="orders-placeholder" className="mt-6">
        <Badge tone="warm">En preparación</Badge>
        <h2 id="orders-placeholder" className="mt-4 text-xl font-extrabold">Seguimiento de órdenes</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">La gestión de órdenes aún no está disponible.</p>
      </Card>
    </>
  );
}
