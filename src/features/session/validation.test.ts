import { describe, expect, it } from "vitest";
import { canManageTeam, isFourDigitPin, isSignInInput } from "./validation";

describe("session validation", () => {
  it("accepts exactly four ASCII digits and rejects malformed PINs", () => {
    expect(isFourDigitPin("0123")).toBe(true);
    for (const pin of ["", "123", "12345", "12a4", "１２３４", " 1234", "1234 "]) {
      expect(isFourDigitPin(pin)).toBe(false);
    }
  });

  it("validates unknown action input before credentials are checked", () => {
    expect(isSignInInput({ staffId: "demo-cajero", pin: "6249" })).toBe(true);
    for (const input of [null, "6249", {}, { staffId: " ", pin: "6249" }, { staffId: "demo", pin: 6249 }, { staffId: "demo", pin: "123" }]) {
      expect(isSignInInput(input)).toBe(false);
    }
  });

  it("grants team management only to an encargado", () => {
    expect(canManageTeam({ role: "encargado" })).toBe(true);
    expect(canManageTeam({ role: "cajero" })).toBe(false);
  });
});
