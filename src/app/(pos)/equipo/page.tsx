import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function TeamPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-[-0.01em]">Equipo</h1>
      <Card as="section" aria-labelledby="team-placeholder" className="mt-6">
        <Badge tone="warm">En preparación</Badge>
        <h2 id="team-placeholder" className="mt-4 text-xl font-extrabold">Administración del equipo</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">La administración del equipo aún no está disponible.</p>
      </Card>
    </>
  );
}
