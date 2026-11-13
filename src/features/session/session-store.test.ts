import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockSession, readMockSession, revokeMockSession, sessionLifetimeSeconds } from "./session-store";

vi.mock("server-only", () => ({}));

const session = { staffId: "ana", name: "Ana", role: "encargado" as const };

describe("mock session store", () => {
  afterEach(() => vi.useRealTimers());

  it("uses distinct opaque tokens and revokes a signed-out session", () => {
    const first = createMockSession(session);
    const second = createMockSession(session);
    expect(first).not.toBe(second);
    expect(first).not.toContain("ana");
    expect(readMockSession(first)).toEqual(session);
    revokeMockSession(first);
    expect(readMockSession(first)).toBeNull();
    expect(readMockSession(second)).toEqual(session);
    revokeMockSession(second);
  });

  it("expires sessions after the configured lifetime", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-13T00:00:00Z"));
    const token = createMockSession(session);
    vi.advanceTimersByTime(sessionLifetimeSeconds * 1000);
    expect(readMockSession(token)).toBeNull();
  });
});
