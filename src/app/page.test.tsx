import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./(pos)/page";

describe("initial home page", () => {
  it("preserves the clearly labelled placeholder workspace", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1, name: "Punto de venta" }))
      .toBeInTheDocument();
    const welcome = screen.getByRole("region", {
      name: "Bienvenido a La Elotiza",
    });
    expect(within(welcome).getByText(/Las funciones de venta aún no están disponibles/))
      .toBeInTheDocument();
  });
});
