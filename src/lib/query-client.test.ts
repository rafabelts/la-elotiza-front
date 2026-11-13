// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { createQueryClient, getQueryClient } from "./query-client";

describe("server query clients", () => {
  const clients: ReturnType<typeof createQueryClient>[] = [];

  afterEach(() => {
    clients.forEach((client) => client.clear());
    clients.length = 0;
  });

  it("does not share cached data between server requests", () => {
    const firstRequest = getQueryClient();
    const secondRequest = getQueryClient();
    clients.push(firstRequest, secondRequest);

    firstRequest.setQueryData(["request-data"], "private to first request");

    expect(secondRequest.getQueryData(["request-data"])).toBeUndefined();
    expect(secondRequest).not.toBe(firstRequest);
  });

  it("reuses fresh query results instead of refetching immediately", async () => {
    const client = createQueryClient();
    clients.push(client);
    const queryFn = vi.fn().mockResolvedValue("cached result");
    const options = { queryKey: ["fresh-result"], queryFn };

    await expect(client.fetchQuery(options)).resolves.toBe("cached result");
    await expect(client.fetchQuery(options)).resolves.toBe("cached result");

    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("retries a failed query once and propagates its error", async () => {
    const client = createQueryClient();
    clients.push(client);
    const error = new Error("Service unavailable");
    const queryFn = vi.fn().mockRejectedValue(error);

    await expect(client.fetchQuery({
      queryKey: ["failed-query"],
      queryFn,
      retryDelay: 0,
    })).rejects.toBe(error);

    expect(queryFn).toHaveBeenCalledTimes(2);
  });
});
