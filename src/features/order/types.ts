import type { CatalogProduct, ProductSelection } from "@/features/catalog/types";

export interface DraftLineInput {
  productId: string;
  selection: ProductSelection;
  quantity: number;
  note: string;
}

export interface DraftLine extends DraftLineInput {
  id: string;
  productSnapshot: CatalogProduct;
}

export interface DraftOrder {
  customerName: string;
  lines: DraftLine[];
}

export interface DraftLineView {
  line: DraftLine;
  product: CatalogProduct;
  unitPriceCents: number;
  totalPriceCents: number;
}

export interface DraftSummary {
  lines: DraftLineView[];
  totalCents: number;
  itemCount: number;
  canConfirm: boolean;
  draftIssue: string | null;
}
