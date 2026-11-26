import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { readMockCatalog } from "../mock-service";
import { ProductConfiguratorDialog } from "./product-configurator-dialog";

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");

afterEach(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, "showModal", originalShowModal);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
});

it("does not carry an existing special instruction into a drink configuration", async () => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) { this.setAttribute("open", ""); }),
  });
  const product = (await readMockCatalog()).products.find((item) => item.id === "agua");
  if (!product) throw new Error("Expected Agua natural in mock catalog");
  const onAccept = vi.fn();
  const user = userEvent.setup();
  render(
    <ProductConfiguratorDialog
      product={product}
      onClose={vi.fn()}
      onAccept={onAccept}
      initial={{ product, selection: {}, quantity: 1, note: "Sin hielo", totalPriceCents: 1500 }}
    />,
  );
  const dialog = screen.getByRole("dialog", { name: "Agua natural" });
  expect(within(dialog).queryByRole("textbox", { name: "Indicación especial" })).not.toBeInTheDocument();
  await user.click(within(dialog).getByRole("button", { name: /Preparar/ }));
  expect(onAccept).toHaveBeenCalledWith(expect.objectContaining({ note: "" }));
});
