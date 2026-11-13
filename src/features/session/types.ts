export type Role = "cajero" | "encargado";

export type StaffChoice = {
  id: string;
  name: string;
};

export type SessionView = {
  staffId: string;
  name: string;
  role: Role;
};

export type SignInInput = {
  staffId: string;
  pin: string;
};

export type SignInResult =
  | { ok: true; session: SessionView }
  | { ok: false; code: "invalid_credentials" | "unavailable"; message: string };
