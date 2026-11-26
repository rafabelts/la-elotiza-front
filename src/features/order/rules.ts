import { calculateTotalPriceCents, calculateUnitPriceCents, validateConfiguration } from "@/features/catalog/rules";
import type { Catalog, CatalogProduct, ProductSelection } from "@/features/catalog/types";
import type { DraftLine, DraftLineInput, DraftOrder, DraftSummary } from "./types";

export function createDraft(): DraftOrder {
  return { customerName: "", lines: [] };
}

function findProduct(catalog: Catalog, productId: string): CatalogProduct {
  const product = catalog.products.find((item) => item.id === productId);
  if (!product) throw new Error("El producto ya no está disponible en el menú.");
  return product;
}

function copySelection(selection: ProductSelection): ProductSelection {
  return Object.fromEntries(Object.entries(selection).map(([key, values]) => [key, [...values]]));
}

function validatedLine(catalog: Catalog, input: DraftLineInput, id: string): DraftLine {
  const product = findProduct(catalog, input.productId);
  const result = validateConfiguration(product, input.selection, input.quantity);
  if (!result.valid) throw new Error(result.issues[0]?.message ?? "La configuración no es válida.");
  calculateTotalPriceCents(product, input.selection, input.quantity);
  if (typeof input.note !== "string") throw new Error("La indicación especial no es válida.");
  return {
    id,
    productId: product.id,
    productSnapshot: product,
    selection: copySelection(input.selection),
    quantity: input.quantity,
    note: product.allowsSpecialInstructions ? input.note.trim() : "",
  };
}

export function setCustomerName(draft: DraftOrder, customerName: string): DraftOrder {
  return { ...draft, customerName };
}

export function addDraftLine(draft: DraftOrder, catalog: Catalog, input: DraftLineInput, id: string): DraftOrder {
  if (!id || draft.lines.some((line) => line.id === id)) throw new Error("La línea necesita un identificador único.");
  return { ...draft, lines: [...draft.lines, validatedLine(catalog, input, id)] };
}

export function updateDraftLine(draft: DraftOrder, catalog: Catalog, id: string, input: DraftLineInput): DraftOrder {
  if (!draft.lines.some((line) => line.id === id)) throw new Error("La línea ya no está en la orden.");
  const replacement = validatedLine(catalog, input, id);
  return { ...draft, lines: draft.lines.map((line) => line.id === id ? replacement : line) };
}

export function removeDraftLine(draft: DraftOrder, id: string): DraftOrder {
  return { ...draft, lines: draft.lines.filter((line) => line.id !== id) };
}

export function setDraftLineQuantity(draft: DraftOrder, catalog: Catalog, id: string, quantity: number): DraftOrder {
  const line = draft.lines.find((item) => item.id === id);
  if (!line) throw new Error("La línea ya no está en la orden.");
  if (quantity === 0) return removeDraftLine(draft, id);
  return updateDraftLine(draft, catalog, id, { ...line, quantity });
}

export function summarizeDraft(draft: DraftOrder, catalog: Catalog): DraftSummary {
  let totalCents = 0;
  let itemCount = 0;
  let draftIssue: string | null = null;
  const lines = draft.lines.map((line) => {
    const product = line.productSnapshot;
    const unitPriceCents = calculateUnitPriceCents(product, line.selection);
    const totalPriceCents = calculateTotalPriceCents(product, line.selection, line.quantity);
    const currentProduct = catalog.products.find((item) => item.id === line.productId);
    if (!currentProduct || !validateConfiguration(currentProduct, line.selection, line.quantity).valid ||
      calculateUnitPriceCents(currentProduct, line.selection) !== unitPriceCents) {
      draftIssue = "El menú cambió. Edita o quita los productos afectados antes de confirmar.";
    }
    totalCents += totalPriceCents;
    itemCount += line.quantity;
    if (!Number.isSafeInteger(totalCents) || !Number.isSafeInteger(itemCount)) {
      throw new RangeError("El total de la orden excede el rango permitido.");
    }
    return { line, product, unitPriceCents, totalPriceCents };
  });
  return {
    lines, totalCents, itemCount,
    canConfirm: lines.length > 0 && draft.customerName.trim().length > 0 && draftIssue === null,
    draftIssue,
  };
}
