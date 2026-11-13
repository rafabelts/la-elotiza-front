"use server";

import { MockSessionUnavailableError } from "./mock-service";
import { authenticateStaff, endSession, startSession } from "./service";
import type { SignInInput, SignInResult } from "./types";
import { isSignInInput } from "./validation";

export async function signInAction(input: SignInInput): Promise<SignInResult> {
  if (!isSignInInput(input)) {
    return { ok: false, code: "invalid_credentials", message: "Selecciona una persona e ingresa un PIN de cuatro dígitos." };
  }

  try {
    const session = await authenticateStaff(input.staffId, input.pin);
    if (!session) {
      return { ok: false, code: "invalid_credentials", message: "PIN incorrecto, intenta de nuevo." };
    }
    await startSession(session);
    return { ok: true, session };
  } catch (error) {
    if (error instanceof MockSessionUnavailableError) {
      return { ok: false, code: "unavailable", message: error.message };
    }
    return { ok: false, code: "unavailable", message: "No se pudo iniciar sesión. Intenta de nuevo." };
  }
}

export async function signOutAction(): Promise<void> {
  await endSession();
}
