import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";
import { Field } from "./field";
import { OptionChip } from "./option-chip";
import { QuantityStepper } from "./quantity-stepper";
import { SegmentedControl } from "./segmented-control";

describe("shared UI controls", () => {
  it("renders a semantic card and textual status without depending on color", () => {
    render(<Card as="section" aria-label="Estado"><Badge tone="warning">Pendiente</Badge></Card>);
    expect(within(screen.getByRole("region", { name: "Estado" })).getByText("Pendiente"))
      .toBeInTheDocument();
  });

  it("keeps buttons out of form submission by default and respects native disabled state", async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const action = vi.fn();
    render(<form onSubmit={submit}><Button onClick={action}>Auxiliar</Button><Button disabled onClick={action}>Inhabilitado</Button><Button type="submit">Guardar</Button></form>);
    await user.click(screen.getByRole("button", { name: "Auxiliar" }));
    await user.click(screen.getByRole("button", { name: "Inhabilitado" }));
    expect(action).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("associates the label, hint, custom description, and validation error with its input", () => {
    render(<><p id="context">Dato requerido</p><Field id="cliente" label="Nombre del cliente" hint="Como aparece en la orden" error="Escribe un nombre" aria-describedby="context" /></>);
    const input = screen.getByRole("textbox", { name: "Nombre del cliente" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Dato requerido Como aparece en la orden Escribe un nombre");
  });

  it("announces a newly displayed validation error", async () => {
    const user = userEvent.setup();
    function Example() {
      const [error, setError] = useState<string | undefined>();
      return <><Field id="nombre" label="Nombre" error={error} /><button type="button" onClick={() => setError("Escribe un nombre")}>Validar</button></>;
    }
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Validar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Escribe un nombre");
  });

  it("exposes option selection and prevents activation when disabled", async () => {
    const user = userEvent.setup();
    const choose = vi.fn();
    render(<><OptionChip selected onClick={choose}>Con chile</OptionChip><OptionChip selected={false} disabled onClick={choose}>Sin stock</OptionChip></>);
    expect(screen.getByRole("button", { name: "Con chile" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Sin stock" }));
    expect(choose).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Con chile" }));
    expect(choose).toHaveBeenCalledTimes(1);
  });

  it("changes a controlled segmented selection by keyboard and skips disabled items", async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState("efectivo");
      return <SegmentedControl label="Método de pago" value={value} onValueChange={setValue} items={[{ value: "efectivo", label: "Efectivo" }, { value: "transferencia", label: "Transferencia" }, { value: "otro", label: "Otro", disabled: true }]} />;
    }
    render(<Example />);
    const group = screen.getByRole("group", { name: "Método de pago" });
    expect(within(group).getByRole("button", { name: "Efectivo" })).toHaveAttribute("aria-pressed", "true");
    await user.tab();
    await user.tab();
    expect(within(group).getByRole("button", { name: "Transferencia" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(within(group).getByRole("button", { name: "Transferencia" })).toHaveAttribute("aria-pressed", "true");
    await user.tab();
    expect(within(group).getByRole("button", { name: "Otro" })).not.toHaveFocus();
  });

  it("stops quantity changes at configured bounds and labels each action", async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState(1);
      return <QuantityStepper label="Cantidad" value={value} min={1} max={2} onChange={setValue} />;
    }
    render(<Example />);
    const group = screen.getByRole("group", { name: "Cantidad" });
    const decrement = within(group).getByRole("button", { name: "Disminuir Cantidad" });
    const increment = within(group).getByRole("button", { name: "Aumentar Cantidad" });
    expect(decrement).toBeDisabled();
    await user.click(increment);
    expect(within(group).getByText("2")).toBeInTheDocument();
    expect(increment).toBeDisabled();
    await user.click(decrement);
    expect(within(group).getByText("1")).toBeInTheDocument();
  });
});
