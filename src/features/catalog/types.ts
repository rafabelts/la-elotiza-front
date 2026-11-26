export type CatalogCategoryId = "esquites" | "elotes" | "especiales" | "bebidas";

export interface CatalogCategory {
  id: CatalogCategoryId;
  name: string;
}

export interface CatalogOption {
  id: string;
  label: string;
  priceCents: number;
  availableForSizeIds?: readonly string[];
}

export interface OptionGroup {
  id: string;
  label: string;
  hint?: string;
  selection: "single" | "multiple";
  minSelections: number;
  maxSelections?: number;
  options: readonly CatalogOption[];
  priceRole?: "base" | "additive";
  includedSelections?: number;
  additionalSelectionPriceCents?: number;
}

export interface CatalogProduct {
  id: string;
  categoryId: CatalogCategoryId;
  allowsSpecialInstructions: boolean;
  name: string;
  description: string;
  basePriceCents: number;
  optionGroups: readonly OptionGroup[];
}

export interface Catalog {
  categories: readonly CatalogCategory[];
  products: readonly CatalogProduct[];
}

export type ProductSelection = Readonly<Record<string, readonly string[]>>;

export interface ConfigurationIssue {
  groupId: string;
  message: string;
}

export interface ConfigurationValidation {
  valid: boolean;
  issues: ConfigurationIssue[];
}
