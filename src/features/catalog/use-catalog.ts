"use client";

import { useQuery } from "@tanstack/react-query";
import { readCatalog } from "./service";

export const catalogQueryKey = ["catalog"] as const;

export function useCatalog() {
  return useQuery({ queryKey: catalogQueryKey, queryFn: readCatalog, retry: false });
}
