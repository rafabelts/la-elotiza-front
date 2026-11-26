import type { SessionView, SignInInput } from "./types";

export function isFourDigitPin(pin: string): boolean {
  return /^[0-9]{4}$/.test(pin);
}

export function canManageTeam(session: Pick<SessionView, "role">): boolean {
  return session.role === "encargado";
}

export function isSignInInput(value: unknown): value is SignInInput {
  if (typeof value !== "object" || value === null) return false;
  if (!("staffId" in value) || !("pin" in value)) return false;
  return typeof value.staffId === "string"
    && value.staffId.trim().length > 0
    && typeof value.pin === "string"
    && isFourDigitPin(value.pin);
}

