import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("initial home page", () => {
  it("provides a branded header and a clearly labelled workspace", () => {
    render(<HomePage />);

    expect(within(screen.getByRole("banner")).getByText("La Elotiza"))
      .toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(within(main).getByRole("heading", { level: 1, name: "Punto de venta" }))
      .toBeInTheDocument();
    const welcome = within(main).getByRole("region", {
      name: "Bienvenido a La Elotiza",
    });
    expect(within(welcome).getByText(/Las funciones de venta aún no están disponibles/))
      .toBeInTheDocument();
  });

  it("makes the skip link the first keyboard stop and points it at focusable main content", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.tab();

    const skipLink = screen.getByRole("link", { name: "Saltar al contenido" });
    const main = screen.getByRole("main");
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute("href", `#${main.id}`);
    expect(main.id).not.toBe("");
    expect(main).toHaveAttribute("tabindex", "-1");
  });
});
