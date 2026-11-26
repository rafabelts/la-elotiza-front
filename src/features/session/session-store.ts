import "server-only";

import { randomBytes } from "node:crypto";
import type { SessionView } from "./types";

export const sessionCookieName = "la_elotiza_mock_session";
export const sessionLifetimeSeconds = 8 * 60 * 60;

type SessionRecord = {
  session: SessionView;
  expiresAt: number;
};

declare global {
  var __laElotizaMockSessions: Map<string, SessionRecord> | undefined;
}

const sessions = globalThis.__laElotizaMockSessions ??= new Map<string, SessionRecord>();

export function createMockSession(session: SessionView): string {
  const token = randomBytes(32).toString("base64url");
  sessions.set(token, {
    session,
    expiresAt: Date.now() + sessionLifetimeSeconds * 1000,
  });
  return token;
}

export function readMockSession(token: string): SessionView | null {
  const record = sessions.get(token);
  if (!record) return null;
  if (record.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return record.session;
}

export function revokeMockSession(token: string): void {
  sessions.delete(token);
}
