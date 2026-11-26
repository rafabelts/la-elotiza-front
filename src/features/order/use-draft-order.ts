"use client";

import { useRef, useState } from "react";
import type { Catalog } from "@/features/catalog/types";
import {
  addDraftLine, createDraft, removeDraftLine, setCustomerName,
  setDraftLineQuantity, summarizeDraft, updateDraftLine,
} from "./rules";
import type { DraftLineInput } from "./types";

export function useDraftOrder(catalog: Catalog) {
  const [draft, setDraft] = useState(createDraft);
  const draftRef = useRef(draft);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const summary = summarizeDraft(draft, catalog);

  function commit(change: (current: typeof draft) => typeof draft): boolean {
    try {
      const next = change(draftRef.current);
      draftRef.current = next;
      setDraft(next);
      setMutationError(null);
      return true;
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "No se pudo actualizar la orden.");
      return false;
    }
  }

  return {
    draft,
    ...summary,
    mutationError,
    setCustomerName: (name: string) => commit((current) => setCustomerName(current, name)),
    addLine: (input: DraftLineInput) => {
      const id = crypto.randomUUID();
      return commit((current) => addDraftLine(current, catalog, input, id));
    },
    updateLine: (id: string, input: DraftLineInput) => commit((current) => updateDraftLine(current, catalog, id, input)),
    setLineQuantity: (id: string, quantity: number) => commit((current) => setDraftLineQuantity(current, catalog, id, quantity)),
    removeLine: (id: string) => commit((current) => removeDraftLine(current, id)),
    resetDraft: () => commit(() => createDraft()),
  };
}
