"use client";

import { Button } from "@/components/ui/button";
import { CatalogScreen } from "@/features/catalog/components/catalog-screen";
import { useCatalog } from "@/features/catalog/use-catalog";

export default function HomePage() {
  const catalog = useCatalog();

  if (catalog.isPending) {
    return <main className="catalog-state" role="status"><h1>Tomar orden</h1><p>Cargando menú…</p></main>;
  }

  if (catalog.isError) {
    return (
      <main className="catalog-state" role="alert">
        <h1>Tomar orden</h1>
        <p>No se pudo cargar el menú. Intenta de nuevo.</p>
        <Button onClick={() => { void catalog.refetch(); }}>Reintentar</Button>
      </main>
    );
  }

  return <CatalogScreen catalog={catalog.data} />;
}
