import { environmentManager, QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1 },
      mutations: { retry: false },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // Server renders must never share cached data across requests.
  if (environmentManager.isServer()) return createQueryClient();

  // Preserve the browser cache even if React suspends the initial render.
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
