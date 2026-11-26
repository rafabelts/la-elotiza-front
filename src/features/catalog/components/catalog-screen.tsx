"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderPanel } from "@/features/order/components/order-panel";
import { useDraftOrder } from "@/features/order/use-draft-order";
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

type SavedMenuStatus = {
  savedAt: number;
  isRefreshing: boolean;
  onRetry: () => void;
};

export function CatalogScreen({ catalog, savedMenu }: { catalog: Catalog; savedMenu?: SavedMenuStatus }) {
  const [categoryId, setCategoryId] = useState(catalog.categories[0]?.id ?? "");
  const [activeProduct, setActiveProduct] = useState<CatalogProduct | null>(null);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const order = useDraftOrder(catalog);

  const editingLine = editingLineId
    ? order.lines.find((view) => view.line.id === editingLineId)
    : undefined;
  const initial = editingLine
    ? {
        product: activeProduct ?? editingLine.product,
        selection: editingLine.line.selection,
        quantity: editingLine.line.quantity,
        note: editingLine.line.note,
        totalPriceCents: editingLine.totalPriceCents,
      }
    : undefined;

  useEffect(() => {
    if (!activeProduct) openerRef.current?.focus();
  }, [activeProduct]);
  const category = catalog.categories.find((item) => item.id === categoryId) ?? catalog.categories[0];
  const products = catalog.products.filter((item) => item.categoryId === category?.id);

  return (
    <div className="catalog-layout">
      <section aria-labelledby="catalog-heading" className="catalog-main">
        <div className="catalog-intro">
          <div>
            <h1 id="catalog-heading" className="text-2xl font-extrabold tracking-[-0.01em]">Tomar orden</h1>
            <p className="mt-1 text-sm text-muted">Elige productos, personalízalos y revisa tu borrador.</p>
          </div>
          <div className="catalog-intro__actions">
            <a href="#orden-actual" className="catalog-order-link">Ver borrador · {order.itemCount} {order.itemCount === 1 ? "producto" : "productos"}</a>
            <p className="catalog-provisional">Menú y precios de demostración</p>
          </div>
        </div>

        {savedMenu && (
          <div className="catalog-saved-menu" role="status">
            <div>
              <p className="catalog-saved-menu__title">Mostrando menú guardado en este dispositivo</p>
              <p>Los precios pueden estar desactualizados. Última actualización: <time dateTime={new Date(savedMenu.savedAt).toISOString()}>{new Date(savedMenu.savedAt).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}</time>.</p>
            </div>
            <Button variant="outline" disabled={savedMenu.isRefreshing} onClick={savedMenu.onRetry}>
              {savedMenu.isRefreshing ? "Actualizando…" : "Reintentar actualización"}
            </Button>
          </div>
        )}

        {catalog.categories.length > 0 ? (
          <>
            <div role="group" aria-label="Categorías del menú" className="catalog-filters">
              {catalog.categories.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={item.id === category?.id}
                  onClick={() => setCategoryId(item.id)}
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
                      onClick={(event) => { openerRef.current = event.currentTarget; setEditingLineId(null); setActiveProduct(product); }}
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

        {actionMessage && <p role="status" className="catalog-action-message">{actionMessage}</p>}
      </section>
      <OrderPanel
        customerName={order.draft.customerName}
        lines={order.lines}
        itemCount={order.itemCount}
        totalCents={order.totalCents}
        draftIssue={order.draftIssue}
        mutationError={order.mutationError}
        onCustomerNameChange={order.setCustomerName}
        onEditLine={(lineId) => {
          const view = order.lines.find((item) => item.line.id === lineId);
          if (!view) return;
          openerRef.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
          setActionMessage("");
          setEditingLineId(lineId);
          setActiveProduct(catalog.products.find((product) => product.id === view.line.productId) ?? view.product);
        }}
        onSetLineQuantity={(lineId, quantity) => {
          if (order.setLineQuantity(lineId, quantity)) setActionMessage("");
        }}
        onRemoveLine={(lineId) => {
          if (!order.removeLine(lineId)) return;
          setActionMessage("Producto quitado del borrador.");
        }}
        onResetDraft={() => {
          if (!order.resetDraft()) return;
          setActionMessage("Borrador descartado. Puedes empezar una nueva orden.");
        }}
      />
      {activeProduct && (
        <ProductConfiguratorDialog
          key={editingLineId ?? activeProduct.id}
          product={activeProduct}
          onClose={() => { setActiveProduct(null); setEditingLineId(null); }}
          error={order.mutationError}
          onAccept={(configuration) => {
            const input = {
              productId: configuration.product.id,
              selection: configuration.selection,
              quantity: configuration.quantity,
              note: configuration.note,
            };
            const saved = editingLineId
              ? order.updateLine(editingLineId, input)
              : order.addLine(input);
            if (!saved) return;
            setActionMessage(editingLineId ? "" : "Producto agregado al borrador.");
            setActiveProduct(null);
            setEditingLineId(null);
          }}
          initial={initial}
        />
      )}
    </div>
  );
}
