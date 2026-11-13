import "server-only";

import { cookies } from "next/headers";
import { authenticateMockStaff, listMockStaffChoices } from "./mock-service";
import {
  createMockSession,
  readMockSession,
  revokeMockSession,
  sessionCookieName,
  sessionLifetimeSeconds,
} from "./session-store";
import type { SessionView, StaffChoice } from "./types";

export interface SessionService {
  listStaffChoices(): Promise<StaffChoice[]>;
  authenticate(staffId: string, pin: string): Promise<SessionView | null>;
}

const mockSessionService: SessionService = {
  listStaffChoices: listMockStaffChoices,
  authenticate: authenticateMockStaff,
};

export async function listStaffChoices(): Promise<StaffChoice[]> {
  return mockSessionService.listStaffChoices();
}

export async function getCurrentSession(): Promise<SessionView | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  return token ? readMockSession(token) : null;
}

export async function startSession(session: SessionView): Promise<void> {
  const cookieStore = await cookies();
  const previousToken = cookieStore.get(sessionCookieName)?.value;
  if (previousToken) revokeMockSession(previousToken);
  cookieStore.set(sessionCookieName, createMockSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (token) revokeMockSession(token);
  cookieStore.delete(sessionCookieName);
}

export async function authenticateStaff(staffId: string, pin: string): Promise<SessionView | null> {
  return mockSessionService.authenticate(staffId, pin);
}
