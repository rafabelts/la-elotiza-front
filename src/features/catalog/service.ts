import { readMockCatalog } from "./mock-service";
import type { Catalog } from "./types";

export interface CatalogReadService {
  readCatalog(): Promise<Catalog>;
}

let service: CatalogReadService = { readCatalog: readMockCatalog };

export function setCatalogReadService(nextService: CatalogReadService): void {
  service = nextService;
}

export function resetCatalogReadService(): void {
  service = { readCatalog: readMockCatalog };
}

export async function readCatalog(): Promise<Catalog> {
  return service.readCatalog();
}
