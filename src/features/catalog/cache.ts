import type { Catalog, CatalogCategoryId } from "./types";

export const catalogStorageKey = "la-elotiza:catalog:v1";
const schemaVersion = 1;
const categoryIds: readonly CatalogCategoryId[] = ["esquites", "elotes", "especiales", "bebidas"];

export interface CatalogLoad {
  catalog: Catalog;
  source: "fresh" | "saved";
  savedAt: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonemptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isNonnegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isOption(value: unknown): boolean {
  return isRecord(value)
    && isNonemptyString(value.id)
    && isNonemptyString(value.label)
    && isNonnegativeInteger(value.priceCents)
    && (value.availableForSizeIds === undefined
      || (Array.isArray(value.availableForSizeIds) && value.availableForSizeIds.every(isNonemptyString)));
}

function isOptionGroup(value: unknown): boolean {
  return isRecord(value)
    && isNonemptyString(value.id)
    && isNonemptyString(value.label)
    && (value.hint === undefined || typeof value.hint === "string")
    && (value.selection === "single" || value.selection === "multiple")
    && isNonnegativeInteger(value.minSelections)
    && (value.maxSelections === undefined || isNonnegativeInteger(value.maxSelections))
    && Array.isArray(value.options) && value.options.every(isOption)
    && (value.priceRole === undefined || value.priceRole === "base" || value.priceRole === "additive")
    && (value.includedSelections === undefined || isNonnegativeInteger(value.includedSelections))
    && (value.additionalSelectionPriceCents === undefined || isNonnegativeInteger(value.additionalSelectionPriceCents));
}

export function isCatalog(value: unknown): value is Catalog {
  return isRecord(value)
    && Array.isArray(value.categories)
    && value.categories.every((category: unknown) => isRecord(category)
      && categoryIds.some((id) => id === category.id)
      && isNonemptyString(category.name))
    && Array.isArray(value.products)
    && value.products.every((product: unknown) => isRecord(product)
      && isNonemptyString(product.id)
      && categoryIds.some((id) => id === product.categoryId)
      && typeof product.allowsSpecialInstructions === "boolean"
      && isNonemptyString(product.name)
      && typeof product.description === "string"
      && isNonnegativeInteger(product.basePriceCents)
      && Array.isArray(product.optionGroups)
      && product.optionGroups.every(isOptionGroup));
}

export function saveCatalog(catalog: Catalog): number {
  const savedAt = Date.now();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(catalogStorageKey, JSON.stringify({ schemaVersion, savedAt, catalog }));
    } catch {
      // Storage can be disabled or full. The current request remains usable.
    }
  }
  return savedAt;
}

export function readSavedCatalog(): CatalogLoad | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(catalogStorageKey);
    if (!raw) return null;
    const snapshot: unknown = JSON.parse(raw);
    if (isRecord(snapshot)
      && snapshot.schemaVersion === schemaVersion
      && isNonnegativeInteger(snapshot.savedAt)
      && snapshot.savedAt <= Date.now()
      && isCatalog(snapshot.catalog)) {
      return { catalog: snapshot.catalog, source: "saved", savedAt: snapshot.savedAt };
    }
    window.localStorage.removeItem(catalogStorageKey);
  } catch {
    // Invalid JSON or unavailable storage cannot provide a usable fallback.
  }
  return null;
}
