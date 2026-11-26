"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Catalog, CatalogProduct, ProductSelection } from "../types";
import { ProductConfiguratorDialog } from "./product-configurator-dialog";

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const categoryClasses: Record<string, string> = {
  esquites: "catalog-card--esquites",
  elotes: "catalog-card--elotes",
  especiales: "catalog-card--especiales",
  bebidas: "catalog-card--bebidas",
};

export type PreparedConfiguration = {
  product: CatalogProduct;
  selection: ProductSelection;
  quantity: number;
  note: string;
  totalPriceCents: number;
};

export function CatalogScreen({ catalog }: { catalog: Catalog }) {
  const [categoryId, setCategoryId] = useState(catalog.categories[0]?.id ?? "");
  const [activeProduct, setActiveProduct] = useState<CatalogProduct | null>(null);
  const [prepared, setPrepared] = useState<PreparedConfiguration | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeProduct) openerRef.current?.focus();
  }, [activeProduct]);
  const category = catalog.categories.find((item) => item.id === categoryId) ?? catalog.categories[0];
  const products = catalog.products.filter((item) => item.categoryId === category?.id);

  return (
    <main className="catalog-layout">
      <section aria-labelledby="catalog-heading" className="catalog-main">
        <div className="catalog-intro">
          <div>
            <h1 id="catalog-heading" className="text-2xl font-extrabold tracking-[-0.01em]">Tomar orden</h1>
            <p className="mt-1 text-sm text-muted">Elige un producto y prepara su configuración.</p>
          </div>
          <p className="catalog-provisional">Menú y precios de demostración</p>
        </div>

        {catalog.categories.length > 0 ? (
          <>
            <div role="group" aria-label="Categorías del menú" className="catalog-filters">
              {catalog.categories.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={item.id === category?.id}
                  onClick={() => { setCategoryId(item.id); setPrepared(null); }}
                  className={`catalog-filter ${item.id === category?.id ? `catalog-filter--active ${categoryClasses[item.id] ?? ""}` : ""}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            {products.length > 0 ? (
              <div className="catalog-grid" aria-label={`Productos de ${category.name}`}>
                {products.map((product) => {
                  const sizeGroup = product.optionGroups.find((group) => group.priceRole === "base");
                  const startingPrice = sizeGroup?.options.length
                    ? Math.min(...sizeGroup.options.map((option) => option.priceCents))
                    : product.basePriceCents;
                  return (
                    <button
                      type="button"
                      key={product.id}
                      className={`catalog-card ${categoryClasses[product.categoryId] ?? ""}`}
                      onClick={(event) => { openerRef.current = event.currentTarget; setActiveProduct(product); if (prepared?.product.id !== product.id) setPrepared(null); }}
                      aria-label={`${product.name}, ${sizeGroup ? "desde " : ""}${currency.format(startingPrice / 100)}. Personalizar`}
                    >
                      <span className="catalog-card__name">{product.name}</span>
                      <span className="catalog-card__description">{product.description}</span>
                      <span className="catalog-card__price">{sizeGroup ? "desde " : ""}{currency.format(startingPrice / 100)}</span>
                    </button>
                  );
                })}
              </div>
            ) : <p className="catalog-empty" role="status">No hay productos en esta categoría.</p>}
          </>
        ) : <p className="catalog-empty" role="status">El menú aún no tiene categorías.</p>}

        {prepared && (
          <div className="catalog-prepared" role="status">
            <div>
              <p className="font-bold">Configuración lista</p>
              <p className="text-sm">{prepared.quantity} × {prepared.product.name} · {currency.format(prepared.totalPriceCents / 100)}</p>
              {prepared.note && <p className="text-sm">Indicación: {prepared.note}</p>}
            </div>
            <Button variant="outline" onClick={(event) => { openerRef.current = event.currentTarget; setActiveProduct(prepared.product); }}>Modificar</Button>
          </div>
        )}
      </section>
      {activeProduct && (
        <ProductConfiguratorDialog
          key={activeProduct.id}
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAccept={(configuration) => { setPrepared(configuration); setActiveProduct(null); }}
          initial={prepared?.product.id === activeProduct.id ? prepared : undefined}
        />
      )}
    </main>
  );
}
