import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import type { DraftLineView } from "../types";
import { OrderPanel } from "./order-panel";

it("explains a changed menu without falsely requesting an already entered customer name", () => {
  render(
    <OrderPanel
      customerName="Ana"
      lines={[{
        line: { id: "line-1", productId: "agua", selection: {}, quantity: 1, note: "", productSnapshot: {
          id: "agua", categoryId: "bebidas", name: "Agua natural", description: "600 ml",
          basePriceCents: 1500, optionGroups: [], allowsSpecialInstructions: false,
        } },
        product: {
          id: "agua", categoryId: "bebidas", name: "Agua natural", description: "600 ml",
          basePriceCents: 1500, optionGroups: [], allowsSpecialInstructions: false,
        },
        unitPriceCents: 1500,
        totalPriceCents: 1500,
      }]}
      itemCount={1}
      totalCents={1500}
      draftIssue="El menú cambió. Edita o quita los productos afectados antes de confirmar."
      mutationError={null}
      onCustomerNameChange={vi.fn()}
      onEditLine={vi.fn()}
      onSetLineQuantity={vi.fn()}
      onRemoveLine={vi.fn()}
      onResetDraft={vi.fn()}
    />,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("El menú cambió");
  expect(screen.getByRole("button", { name: "Confirmar orden" })).toBeDisabled();
  expect(screen.queryByText("Escribe el nombre del cliente para preparar la orden.")).not.toBeInTheDocument();
  expect(screen.queryByText("Borrador")).not.toBeInTheDocument();
  expect(screen.queryByText("Borrador listo para confirmar.")).not.toBeInTheDocument();
});

it("keeps configuration, note, price, and line actions readable within the product list", async () => {
  const user = userEvent.setup();
  const onEditLine = vi.fn();
  const onSetLineQuantity = vi.fn();
  const onRemoveLine = vi.fn();
  const product: DraftLineView["product"] = {
    id: "esquite", categoryId: "esquites", name: "Esquite tradicional", description: "",
    basePriceCents: 4000, allowsSpecialInstructions: true,
    optionGroups: [{ id: "size", label: "Tamaño", selection: "single", minSelections: 1,
      options: [{ id: "grande", label: "Grande", priceCents: 5000 }] }],
  };
  const lines: DraftLineView[] = [{
    line: { id: "line-1", productId: product.id, productSnapshot: product,
      selection: { size: ["grande"] }, quantity: 2, note: "Poco limón" },
    product, unitPriceCents: 5000, totalPriceCents: 10000,
  }];

  render(<OrderPanel customerName="Ana" lines={lines} itemCount={2} totalCents={10000}
    draftIssue={null} mutationError={null} onCustomerNameChange={vi.fn()}
    onEditLine={onEditLine} onSetLineQuantity={onSetLineQuantity}
    onRemoveLine={onRemoveLine} onResetDraft={vi.fn()} />);

  const item = screen.getByRole("listitem");
  expect(item).toHaveTextContent("2 × Esquite tradicional");
  expect(item).toHaveTextContent("Tamaño: Grande");
  expect(item).toHaveTextContent("Indicación: Poco limón");
  expect(item).toHaveTextContent(/100[.,]00/);
  expect(screen.getByRole("status", { name: /Total de la orden/ })).toHaveTextContent(/100[.,]00/);

  await user.click(within(item).getByRole("button", { name: "Aumentar cantidad de Esquite tradicional, línea 1" }));
  await user.click(within(item).getByRole("button", { name: "Editar Esquite tradicional, línea 1" }));
  await user.click(within(item).getByRole("button", { name: "Quitar Esquite tradicional, línea 1 de la orden" }));
  expect(onSetLineQuantity).toHaveBeenCalledWith("line-1", 3);
  expect(onEditLine).toHaveBeenCalledWith("line-1");
  expect(onRemoveLine).toHaveBeenCalledWith("line-1");
});
