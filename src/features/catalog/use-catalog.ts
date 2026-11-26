"use client";

import { useQuery } from "@tanstack/react-query";
import { isCatalog, readSavedCatalog, saveCatalog } from "./cache";
import { readCatalog } from "./service";

export const catalogQueryKey = ["catalog"] as const;

export function useCatalog() {
  return useQuery({
    queryKey: catalogQueryKey,
    queryFn: async () => {
      try {
        const catalog = await readCatalog();
        if (!isCatalog(catalog)) throw new Error("Invalid catalog response");
        return { catalog, source: "fresh" as const, savedAt: saveCatalog(catalog) };
      } catch (error) {
        const saved = readSavedCatalog();
        if (saved) return saved;
        throw error;
      }
    },
    retry: false,
  });
}
