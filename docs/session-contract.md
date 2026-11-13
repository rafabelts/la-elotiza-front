# Provisional session contract

This contract supports [roadmap milestone 1](ROADMAP.md) only. It is a local demonstration of session entry and role-based navigation, not a production authentication specification.

## Boundary and flow

- `src/features/session/types.ts` defines `StaffChoice`, `SessionView`, `Role`, and the sign-in result. UI receives names, IDs, role, and typed errors; PIN values never enter server-rendered props or the client response.
- The public `/iniciar-sesion` page loads only staff names/IDs. The client sends a selected ID and four-digit PIN through a Next.js server action. A replaceable `SessionService` delegates credential checking to the server-only mock service. No REST endpoint or backend contract is implied.
- A successful sign-in stores an opaque 256-bit random token in an `HttpOnly`, `SameSite=Lax` cookie. The token maps to an eight-hour session in server memory. Signing out revokes the token and clears the cookie. The browser uses TanStack Query mutations for sign-in/out and refreshes navigation after success. Staff choices are server-fetched, avoiding an extra client request.
- The `(pos)` layout checks the session on every protected route. `/equipo` has an additional server-side role guard; a cajero is redirected to `/`. Hiding `Equipo` in navigation is only a presentation detail, not the authorization check.

## Local demo identities

The server-only development mock includes two fictional identities: **Ana (demo)**, encargado, PIN **4837**; and **Luis (demo)**, cajero, PIN **6249**. These are deliberately different from the prototype's sample identities/PINs. No PIN hint is rendered in the UI. The mock is disabled when `NODE_ENV=production`; the deployed app requires a real identity provider before staff can sign in.

## Limitations and replacement

The in-memory session map is local to one server process. Sessions disappear on restart and are not synchronized across workers or devices. The demo has no durable staff store, credential hashing, rate limiting, lockout, audit trail, revocation across servers, or production identity provider. These are backend/security decisions, not promises of the provisional service interface. A real implementation must replace the mock service and session store with secure server-side verification and authorization before production use. Team administration belongs to roadmap milestone 9 and is not implemented here.
