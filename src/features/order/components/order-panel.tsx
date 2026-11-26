"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { DraftLineView } from "../types";

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export type OrderPanelProps = {
  customerName: string;
  lines: DraftLineView[];
  itemCount: number;
  totalCents: number;
  draftIssue: string | null;
  mutationError: string | null;
  onCustomerNameChange: (name: string) => void;
  onEditLine: (lineId: string) => void;
  onSetLineQuantity: (lineId: string, quantity: number) => void;
  onRemoveLine: (lineId: string) => void;
  onResetDraft: () => void;
};

function lineDetails({ line, product }: DraftLineView): string[] {
  const choices = product.optionGroups.flatMap((group) => {
    const selected = line.selection[group.id] ?? [];
    const names = selected
      .map((id) => group.options.find((option) => option.id === id)?.label)
      .filter((name): name is string => name !== undefined);
    return names.length ? [`${group.label}: ${names.join(", ")}`] : [];
  });
  return choices.length > 0 ? choices : ["Como viene"];
}

export function OrderPanel({
  customerName,
  lines,
  itemCount,
  totalCents,
  draftIssue,
  mutationError,
  onCustomerNameChange,
  onEditLine,
  onSetLineQuantity,
  onRemoveLine,
  onResetDraft,
}: OrderPanelProps) {
  const customerId = useId();
  const needsName = lines.length > 0 && !customerName.trim();
  const hasDraft = lines.length > 0 || customerName.length > 0;

  return (
    <aside aria-label="Orden actual" id="orden-actual" tabIndex={-1} className="order-panel">
      <div className="order-panel__header">
        <div className="order-panel__heading">
          <h2>Orden actual</h2>
        </div>
        <Field
          id={customerId}
          label="Nombre del cliente"
          placeholder="Ej. Rafa"
          autoComplete="off"
          value={customerName}
          onChange={(event) => onCustomerNameChange(event.target.value)}
          error={needsName ? "Falta el nombre para llamar al cliente." : undefined}
        />
        {draftIssue && <p role="alert" className="order-panel__warning">{draftIssue}</p>}
        {mutationError && <p role="alert" className="order-panel__warning">{mutationError}</p>}
      </div>

      <div className="order-panel__body">
        {lines.length === 0 ? (
          <p className="order-panel__empty">Toca un producto para agregarlo.</p>
        ) : (
          <ul className="order-panel__lines">
            {lines.map((view, index) => {
              const { line, product } = view;
              const lineName = `${product.name}, línea ${index + 1}`;
              return (
                <li className="order-line" key={line.id}>
                  <div className="order-line__top">
                    <p className="order-line__name">{line.quantity} × {product.name}</p>
                    <p className="order-line__price">{currency.format(view.totalPriceCents / 100)}</p>
                  </div>
                  <div className="order-line__details">
                    {lineDetails(view).map((detail) => (
                      <span className="order-line__detail" key={detail}>{detail}</span>
                    ))}
                  </div>
                  {line.note && <p className="order-line__note">Indicación: {line.note}</p>}
                  <div className="order-line__actions">
                    <div role="group" aria-label={`Cantidad de ${lineName}`} className="order-line__quantity">
                      <button type="button" aria-label={`Disminuir cantidad de ${lineName}`} onClick={() => onSetLineQuantity(line.id, line.quantity - 1)}>−</button>
                      <output aria-label={`Cantidad de ${lineName}`}>{line.quantity}</output>
                      <button type="button" aria-label={`Aumentar cantidad de ${lineName}`} onClick={() => onSetLineQuantity(line.id, line.quantity + 1)}>+</button>
                    </div>
                    <div className="order-line__secondary">
                      <Button variant="ghost" onClick={() => onEditLine(line.id)} aria-label={`Editar ${lineName}`}>Editar</Button>
                      <Button variant="ghost" onClick={() => onRemoveLine(line.id)} aria-label={`Quitar ${lineName} de la orden`}>Quitar</Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="order-panel__footer">
        <div className="order-panel__total">
          <span>Total · {itemCount} {itemCount === 1 ? "producto" : "productos"}</span>
          <output aria-live="polite" aria-atomic="true" aria-label={`Total de la orden: ${currency.format(totalCents / 100)}`}>
            {currency.format(totalCents / 100)}
          </output>
        </div>
        <Button className="order-panel__confirm" disabled aria-describedby="order-confirm-note">Confirmar orden</Button>
        <p id="order-confirm-note" className="order-panel__limit">El envío a cocina estará disponible en la siguiente etapa.</p>
        {hasDraft && (
          <Button variant="ghost" className="order-panel__reset" onClick={onResetDraft}>
            Descartar borrador y empezar de nuevo
          </Button>
        )}
      </div>
    </aside>
  );
}
