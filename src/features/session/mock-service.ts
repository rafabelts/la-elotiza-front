import "server-only";

import type { SessionView, StaffChoice } from "./types";

type MockStaff = StaffChoice & { role: SessionView["role"]; pin: string };

// Fictional development credentials. This module is server-only and is disabled
// in production; it is not an authentication design for a deployed POS.
const developmentStaff: readonly MockStaff[] = [
  { id: "demo-encargada", name: "Ana (demo)", role: "encargado", pin: "4837" },
  { id: "demo-cajero", name: "Luis (demo)", role: "cajero", pin: "6249" },
];

export class MockSessionUnavailableError extends Error {
  constructor() {
    super("El acceso de demostración no está disponible.");
  }
}

function availableStaff(): readonly MockStaff[] {
  if (process.env.NODE_ENV === "production") return [];
  return developmentStaff;
}

export async function listMockStaffChoices(): Promise<StaffChoice[]> {
  return availableStaff().map(({ id, name }) => ({ id, name }));
}

export async function authenticateMockStaff(
  staffId: string,
  pin: string,
): Promise<SessionView | null> {
  if (process.env.NODE_ENV === "production") throw new MockSessionUnavailableError();
  const staff = availableStaff().find((candidate) => candidate.id === staffId);
  if (!staff || staff.pin !== pin) return null;
  return { staffId: staff.id, name: staff.name, role: staff.role };
}
