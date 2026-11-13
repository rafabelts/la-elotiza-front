import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
const mutation = vi.hoisted(() => ({ mutateAsync: vi.fn(), isPending: false }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));
vi.mock("@/features/session/use-session-mutations", () => ({ useSignOut: () => mutation }));

import { AppShell } from "./app-shell";

describe("AppShell session navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigation.pathname = "/";
    mutation.isPending = false;
  });

  it("marks the current route, hides team navigation from a cajero, and preserves the skip link", async () => {
    const user = userEvent.setup();
    render(<AppShell session={{ staffId: "luis", name: "Luis", role: "cajero" }}><h1>Punto de venta</h1></AppShell>);
    await user.tab();
    const skip = screen.getByRole("link", { name: "Saltar al contenido" });
    const main = screen.getByRole("main");
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute("href", `#${main.id}`);
    expect(main).toHaveAttribute("tabindex", "-1");
    const nav = screen.getByRole("navigation", { name: "Secciones" });
    expect(within(nav).getByRole("link", { name: "Tomar orden" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).queryByRole("link", { name: "Equipo" })).not.toBeInTheDocument();
  });

  it("shows manager navigation and signs out using the session action", async () => {
    const user = userEvent.setup();
    navigation.pathname = "/equipo";
    mutation.mutateAsync.mockResolvedValue(undefined);
    render(<AppShell session={{ staffId: "ana", name: "Ana", role: "encargado" }}><h1>Equipo</h1></AppShell>);
    expect(within(screen.getByRole("navigation", { name: "Secciones" })).getByRole("link", { name: "Equipo" }))
      .toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Salir de la sesión de Ana" }));
    expect(mutation.mutateAsync).toHaveBeenCalledOnce();
  });

  it("announces signout failure without hiding the workspace", async () => {
    const user = userEvent.setup();
    mutation.mutateAsync.mockRejectedValue(new Error("offline"));
    render(<AppShell session={{ staffId: "ana", name: "Ana", role: "encargado" }}><h1>Punto de venta</h1></AppShell>);
    await user.click(screen.getByRole("button", { name: "Salir de la sesión de Ana" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo cerrar sesión");
    expect(screen.getByRole("main")).toContainElement(screen.getByRole("heading", { name: "Punto de venta" }));
  });
});
