import { beforeEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({
  authenticateStaff: vi.fn(),
  startSession: vi.fn(),
  endSession: vi.fn(),
}));

vi.mock("./service", () => service);
vi.mock("./mock-service", () => ({ MockSessionUnavailableError: class MockSessionUnavailableError extends Error {} }));

import { signInAction, signOutAction } from "./actions";

describe("session actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects malformed input without consulting the credential service", async () => {
    const result = await signInAction({ staffId: "demo", pin: "12" });
    expect(result).toMatchObject({ ok: false, code: "invalid_credentials" });
    expect(service.authenticateStaff).not.toHaveBeenCalled();
  });

  it("does not create a session for incorrect credentials", async () => {
    service.authenticateStaff.mockResolvedValue(null);
    const result = await signInAction({ staffId: "demo", pin: "1234" });
    expect(result).toMatchObject({ ok: false, code: "invalid_credentials" });
    expect(service.startSession).not.toHaveBeenCalled();
  });

  it("creates a session only after successful verification", async () => {
    const session = { staffId: "demo", name: "Ana", role: "encargado" };
    service.authenticateStaff.mockResolvedValue(session);
    const result = await signInAction({ staffId: "demo", pin: "1234" });
    expect(service.startSession).toHaveBeenCalledWith(session);
    expect(result).toEqual({ ok: true, session });
  });

  it("surfaces service failures without claiming sign-in succeeded", async () => {
    service.authenticateStaff.mockRejectedValue(new Error("offline"));
    expect(await signInAction({ staffId: "demo", pin: "1234" }))
      .toMatchObject({ ok: false, code: "unavailable" });
    expect(service.startSession).not.toHaveBeenCalled();
  });

  it("revokes the session on sign-out", async () => {
    await signOutAction();
    expect(service.endSession).toHaveBeenCalledOnce();
  });
});
