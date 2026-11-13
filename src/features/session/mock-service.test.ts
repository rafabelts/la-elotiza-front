import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { authenticateMockStaff, listMockStaffChoices } from "./mock-service";

describe("development staff mock", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("lists only safe staff choices and verifies the correct PIN server-side", async () => {
    const staff = await listMockStaffChoices();
    expect(staff).toEqual([{ id: "demo-encargada", name: "Ana (demo)" }, { id: "demo-cajero", name: "Luis (demo)" }]);
    expect(JSON.stringify(staff)).not.toContain("4837");
    expect(await authenticateMockStaff("demo-encargada", "0000")).toBeNull();
    expect(await authenticateMockStaff("demo-encargada", "4837"))
      .toEqual({ staffId: "demo-encargada", name: "Ana (demo)", role: "encargado" });
    expect(await authenticateMockStaff("demo-cajero", "6249"))
      .toEqual({ staffId: "demo-cajero", name: "Luis (demo)", role: "cajero" });
  });

  it("disables demo credentials in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(await listMockStaffChoices()).toEqual([]);
    await expect(authenticateMockStaff("demo-encargada", "4837"))
      .rejects.toThrow("El acceso de demostración no está disponible");
  });
});
