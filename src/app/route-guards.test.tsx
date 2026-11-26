import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ getCurrentSession: vi.fn(), listStaffChoices: vi.fn() }));
const navigation = vi.hoisted(() => ({ redirect: vi.fn((path: string) => { throw new Error(`REDIRECT:${path}`); }) }));
vi.mock("next/navigation", () => navigation);
vi.mock("@/features/session/service", () => session);
vi.mock("@/components/app-shell", () => ({ AppShell: ({ children }: { children: React.ReactNode }) => <div data-testid="shell">{children}</div> }));
vi.mock("@/features/session/components/login-screen", () => ({ LoginScreen: ({ staff }: { staff: readonly unknown[] }) => <p>Staff choices: {staff.length}</p> }));

import PosLayout from "./(pos)/layout";
import TeamLayout from "./(pos)/equipo/layout";
import SignInPage from "./iniciar-sesion/page";
import SignInError from "./iniciar-sesion/error";
import SignInLoading from "./iniciar-sesion/loading";

describe("server route guards", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects anonymous access to the sign-in page", async () => {
    session.getCurrentSession.mockResolvedValue(null);
    await expect(PosLayout({ children: <p>Protected</p> })).rejects.toThrow("REDIRECT:/iniciar-sesion");
    await expect(TeamLayout({ children: <p>Team</p> })).rejects.toThrow("REDIRECT:/iniciar-sesion");
  });

  it("denies direct team access to a cajero while allowing the POS shell", async () => {
    session.getCurrentSession.mockResolvedValue({ staffId: "luis", name: "Luis", role: "cajero" });
    await expect(TeamLayout({ children: <p>Team</p> })).rejects.toThrow("REDIRECT:/");
    render(await PosLayout({ children: <p>Protected</p> }));
    expect(screen.getByText("Protected")).toBeInTheDocument();
  });

  it("allows an encargado into the team page", async () => {
    session.getCurrentSession.mockResolvedValue({ staffId: "ana", name: "Ana", role: "encargado" });
    render(await TeamLayout({ children: <p>Team</p> }));
    expect(screen.getByText("Team")).toBeInTheDocument();
  });

  it("redirects an active session away from sign-in and otherwise loads staff choices", async () => {
    session.getCurrentSession.mockResolvedValue({ staffId: "ana", name: "Ana", role: "encargado" });
    await expect(SignInPage()).rejects.toThrow("REDIRECT:/");
    session.getCurrentSession.mockResolvedValue(null);
    session.listStaffChoices.mockResolvedValue([{ id: "ana", name: "Ana" }]);
    render(await SignInPage());
    expect(screen.getByText("Staff choices: 1")).toBeInTheDocument();
  });

  it("routes staff-loading failure to an accessible recovery boundary", async () => {
    const user = userEvent.setup();
    session.getCurrentSession.mockResolvedValue(null);
    session.listStaffChoices.mockRejectedValue(new Error("offline"));
    await expect(SignInPage()).rejects.toThrow("offline");
    const reset = vi.fn();
    render(<SignInError reset={reset} />);
    expect(screen.getByRole("heading", { name: "No se pudo cargar el inicio de sesión" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Inténtalo de nuevo");
    await user.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(reset).toHaveBeenCalledOnce();
  });

  it("provides a visible loading status while the sign-in page streams", () => {
    render(<SignInLoading />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando inicio de sesión");
  });
});
