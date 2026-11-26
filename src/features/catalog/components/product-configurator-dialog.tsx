"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { OptionChip } from "@/components/ui/option-chip";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import {
  calculateTotalPriceCents,
  getAvailableOptions,
  validateConfiguration,
} from "../rules";
import type { CatalogProduct, ProductSelection } from "../types";
import type { PreparedConfiguration } from "./catalog-screen";

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export type ProductConfiguratorDialogProps = {
  product: CatalogProduct;
  onClose: () => void;
  onAccept: (configuration: PreparedConfiguration) => void;
  initial?: PreparedConfiguration;
};

export function ProductConfiguratorDialog({ product, onClose, onAccept, initial }: ProductConfiguratorDialogProps) {
  const noteId = useId();
  const [selection, setSelection] = useState<ProductSelection>(() => {
    if (initial) return initial.selection;
    const sizeGroup = product.optionGroups.find((group) => group.priceRole === "base");
    return sizeGroup?.options[0] ? { [sizeGroup.id]: [sizeGroup.options[0].id] } : {};
  });
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [note, setNote] = useState(initial?.note ?? "");
  const validation = validateConfiguration(product, selection, quantity);
  const total = calculateTotalPriceCents(product, selection, quantity);

  function choose(groupId: string, optionId: string, mode: "single" | "multiple") {
    setSelection((current) => {
      const currentValues = current[groupId] ?? [];
      const nextValues = mode === "single"
        ? [optionId]
        : currentValues.includes(optionId)
          ? currentValues.filter((value) => value !== optionId)
          : [...currentValues, optionId];
      const next: Record<string, string[]> = Object.fromEntries(
        Object.entries(current).map(([key, values]) => [key, [...values]]),
      );
      next[groupId] = nextValues;
      // A new size can make a previously selected conditional option unavailable.
      for (const group of product.optionGroups) {
        const available = new Set(getAvailableOptions(group, next).map((option) => option.id));
        next[group.id] = (next[group.id] ?? []).filter((value) => available.has(value));
      }
      return next;
    });
  }

  return (
    <Dialog open title={product.name} onClose={onClose} className="catalog-dialog">
      <p className="mb-5 text-sm leading-relaxed text-muted">{product.description}</p>
      <div className="catalog-dialog__groups">
        {product.optionGroups.map((group) => {
          const selected = selection[group.id] ?? [];
          const issue = validation.issues.find((item) => item.groupId === group.id);
          const issueId = `${noteId}-${group.id}-issue`;
          const hintId = `${noteId}-${group.id}-hint`;
          const availableIds = new Set(getAvailableOptions(group, selection).map((option) => option.id));
          return (
            <fieldset key={group.id} className="catalog-option-group" aria-describedby={`${hintId}${issue ? ` ${issueId}` : ""}`}>
              <legend className="catalog-option-group__title">{group.label}{group.minSelections > 0 ? " *" : ""}</legend>
              <p id={hintId} className="catalog-option-group__hint">
                {group.hint ?? (group.minSelections > 0 ? "Obligatorio" : "Opcional")}
              </p>
              <div className="catalog-option-group__options">
                {group.options.map((option) => {
                  const isSelected = selected.includes(option.id);
                  const maxReached = group.selection === "multiple" && group.maxSelections !== undefined && selected.length >= group.maxSelections;
                  const unavailableForSize = !availableIds.has(option.id);
                  const unavailable = unavailableForSize || (!isSelected && maxReached);
                  const priceLabel = group.priceRole === "base"
                    ? currency.format(option.priceCents / 100)
                    : option.priceCents > 0 ? `+${currency.format(option.priceCents / 100)}` : "";
                  return (
                    <OptionChip
                      key={option.id}
                      selected={isSelected}
                      disabled={unavailable}
                      onClick={() => choose(group.id, option.id, group.selection)}
                      aria-label={`${option.label}${priceLabel ? `, ${priceLabel}` : ""}${unavailableForSize ? ", no disponible para este tamaño" : ""}`}
                    >
                      {option.label}
                      {priceLabel && <span className="catalog-option-price">{priceLabel}</span>}
                      {unavailableForSize && <span className="catalog-option-unavailable">Solo para otro tamaño</span>}
                    </OptionChip>
                  );
                })}
              </div>
              {issue && <p id={issueId} className="catalog-option-group__warning">{issue.message}</p>}
            </fieldset>
          );
        })}
        {product.allowsSpecialInstructions && (
          <Field
            id={noteId}
            label="Indicación especial"
            placeholder="Ej. sin chile, poco limón"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        )}
      </div>
      <div className="catalog-dialog__footer">
        <QuantityStepper label="cantidad" value={quantity} onChange={setQuantity} min={1} />
        <div className="catalog-dialog__actions">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button
            disabled={!validation.valid}
            onClick={() => {
              if (!validation.valid) return;
              onAccept({ product, selection, quantity, note: product.allowsSpecialInstructions ? note.trim() : "", totalPriceCents: total });
            }}
          >
            Preparar · {currency.format(total / 100)}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
