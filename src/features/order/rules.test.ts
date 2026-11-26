import { describe, expect, it } from "vitest";
import { readMockCatalog } from "@/features/catalog/mock-service";
import type { Catalog } from "@/features/catalog/types";
import {
  addDraftLine, createDraft, removeDraftLine, setCustomerName,
  setDraftLineQuantity, summarizeDraft, updateDraftLine,
} from "./rules";

describe("editable draft rules", () => {
  it("keeps distinct lines and selections, and recalculates every quantity, edit, and removal", async () => {
    const catalog = await readMockCatalog();
    const first = { productId: "esq", selection: { size: ["9 oz"], extras: ["tocino"] }, quantity: 2, note: "Poco limón" };
    const second = { productId: "esq", selection: { size: ["12 oz"] }, quantity: 1, note: "" };
    let draft = addDraftLine(createDraft(), catalog, first, "line-1");
    draft = addDraftLine(draft, catalog, second, "line-2");
    expect(draft.lines.map((line) => line.id)).toEqual(["line-1", "line-2"]);
    expect(draft.lines[0].selection).not.toBe(first.selection);
    expect(summarizeDraft(draft, catalog)).toMatchObject({ totalCents: 20800, itemCount: 3, canConfirm: false });

    draft = setCustomerName(draft, "  Ana  ");
    expect(summarizeDraft(draft, catalog).canConfirm).toBe(true);
    expect(summarizeDraft(setCustomerName(draft, "   "), catalog).canConfirm).toBe(false);
    draft = setDraftLineQuantity(draft, catalog, "line-2", 3);
    expect(summarizeDraft(draft, catalog)).toMatchObject({ totalCents: 30400, itemCount: 5 });
    draft = updateDraftLine(draft, catalog, "line-1", { ...first, selection: { size: ["20 oz"] }, quantity: 1, note: "Sin chile" });
    expect(draft.lines[0]).toMatchObject({ id: "line-1", note: "Sin chile", quantity: 1 });
    expect(summarizeDraft(draft, catalog).totalCents).toBe(23300);
    draft = removeDraftLine(draft, "line-2");
    expect(summarizeDraft(draft, catalog)).toMatchObject({ totalCents: 8900, itemCount: 1 });
  });

  it("removes at zero and rejects invalid quantities, configurations, and duplicate IDs", async () => {
    const catalog = await readMockCatalog();
    const input = { productId: "agua", selection: {}, quantity: 1, note: "" };
    const draft = addDraftLine(createDraft(), catalog, input, "line-1");
    expect(setDraftLineQuantity(draft, catalog, "line-1", 0).lines).toHaveLength(0);
    for (const quantity of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => setDraftLineQuantity(draft, catalog, "line-1", quantity)).toThrow();
    }
    expect(() => addDraftLine(draft, catalog, input, "line-1")).toThrow();
    expect(() => addDraftLine(draft, catalog, { ...input, productId: "missing" }, "line-2")).toThrow();
    expect(() => addDraftLine(draft, catalog, { ...input, selection: { flavor: ["unknown"] } }, "line-2")).toThrow();
  });

  it("preserves the priced draft but blocks readiness after catalog removal or repricing", async () => {
    const catalog = await readMockCatalog();
    const draft = setCustomerName(addDraftLine(createDraft(), catalog, { productId: "agua", selection: {}, quantity: 2, note: "" }, "line-1"), "Ana");
    const removed: Catalog = { ...catalog, products: catalog.products.filter((product) => product.id !== "agua") };
    expect(summarizeDraft(draft, removed)).toMatchObject({ totalCents: 3000, canConfirm: false });
    expect(summarizeDraft(draft, removed).draftIssue).toMatch(/menú cambió/);
    const repriced: Catalog = {
      ...catalog,
      products: catalog.products.map((product) => product.id === "agua" ? { ...product, basePriceCents: 2000 } : product),
    };
    expect(summarizeDraft(draft, repriced)).toMatchObject({ totalCents: 3000, canConfirm: false });
    const updated = updateDraftLine(draft, repriced, "line-1", { productId: "agua", selection: {}, quantity: 2, note: "" });
    expect(summarizeDraft(updated, repriced)).toMatchObject({ totalCents: 4000, canConfirm: true, draftIssue: null });
  });
});
