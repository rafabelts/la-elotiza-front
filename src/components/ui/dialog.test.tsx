import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "./dialog";

describe("Dialog", () => {
  const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
  const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");

  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
      this.querySelector<HTMLButtonElement>("button")?.focus();
    }) });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    }) });
  });

  afterEach(() => {
    if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, "showModal", originalShowModal);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
    if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, "close", originalClose);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
  });

  it("labels the modal, closes with its native close action, and returns focus", async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = useState(false);
      return <><button type="button" onClick={() => setOpen(true)}>Abrir cobro</button><Dialog open={open} title="Cobrar" onClose={() => setOpen(false)}><p>Total pendiente</p></Dialog></>;
    }
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Abrir cobro" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Cobrar" });
    expect(dialog).toHaveAttribute("open");
    expect(screen.getByText("Total pendiente")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(dialog).not.toHaveAttribute("open");
    expect(trigger).toHaveFocus();
  });

  it("notifies its controller when the native dialog closes, as on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    function Example() {
      const [open, setOpen] = useState(false);
      return <><button type="button" onClick={() => setOpen(true)}>Disparador</button><Dialog open={open} title="Confirmar" onClose={onClose}><p>Contenido</p></Dialog></>;
    }
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Disparador" }));
    const dialog = screen.getByRole("dialog", { name: "Confirmar" });
    dialog.dispatchEvent(new Event("close"));
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Disparador" })).toHaveFocus();
    await user.tab();
  });
});
