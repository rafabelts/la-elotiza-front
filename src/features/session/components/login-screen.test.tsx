import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mutation = vi.hoisted(() => ({ mutateAsync: vi.fn(), isPending: false }));
vi.mock("@/features/session/use-session-mutations", () => ({ useSignIn: () => mutation }));

import { LoginScreen } from "./login-screen";

const staff = [{ id: "ana", name: "Ana" }, { id: "luis", name: "Luis" }];

describe("LoginScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutation.isPending = false;
  });

  it("shows an empty state when no staff choices exist", () => {
    render(<LoginScreen staff={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No hay personas disponibles");
    expect(screen.queryByRole("button", { name: "Iniciar sesión" })).not.toBeInTheDocument();
  });

  it("supports named staff selection, keypad digits, deletion, and four-digit gating", async () => {
    const user = userEvent.setup();
    render(<LoginScreen staff={staff} />);
    const pin = screen.getByLabelText("PIN de 4 dígitos");
    const submit = screen.getByRole("button", { name: "Iniciar sesión" });
    expect(screen.getByRole("radio", { name: "Ana" })).toBeChecked();
    expect(submit).toBeDisabled();
    for (const digit of ["1", "2", "3", "4"]) await user.click(within(screen.getByLabelText("Teclado numérico")).getByRole("button", { name: digit }));
    expect(pin).toHaveValue("1234");
    expect(submit).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Borrar último dígito" }));
    expect(pin).toHaveValue("123");
    expect(submit).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "Luis" }));
    expect(pin).toHaveValue("");
    expect(screen.getByRole("radio", { name: "Luis" })).toBeChecked();
  });

  it("accepts physical keyboard input while stripping non-digits and limiting to four", async () => {
    const user = userEvent.setup();
    render(<LoginScreen staff={staff} />);
    const pin = screen.getByLabelText("PIN de 4 dígitos");
    await user.type(pin, "1a2b34");
    expect(pin).toHaveValue("1234");
    await user.keyboard("{Backspace}");
    expect(pin).toHaveValue("123");
  });

  it("accepts digits and Backspace without focusing the PIN field", async () => {
    const user = userEvent.setup();
    render(<LoginScreen staff={staff} />);
    const pin = screen.getByLabelText("PIN de 4 dígitos");
    expect(document.body).toHaveFocus();
    await user.keyboard("12345");
    expect(pin).toHaveValue("1234");
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeEnabled();
    await user.keyboard("{Backspace}");
    expect(pin).toHaveValue("123");
  });

  it("accepts physical digits while a staff radio or keypad button has focus", async () => {
    const user = userEvent.setup();
    render(<LoginScreen staff={staff} />);
    const pin = screen.getByLabelText("PIN de 4 dígitos");
    const radio = screen.getByRole("radio", { name: "Luis" });
    await user.click(radio);
    expect(radio).toHaveFocus();
    await user.keyboard("12");
    expect(pin).toHaveValue("12");
    const three = within(screen.getByLabelText("Teclado numérico")).getByRole("button", { name: "3" });
    await user.click(three);
    expect(three).toHaveFocus();
    expect(pin).toHaveValue("123");
    await user.keyboard("4{Backspace}");
    expect(pin).toHaveValue("123");
  });

  it("does not double append when typing in the focused PIN input", async () => {
    const user = userEvent.setup();
    render(<LoginScreen staff={staff} />);
    const pin = screen.getByLabelText("PIN de 4 dígitos");
    await user.click(pin);
    await user.keyboard("12");
    expect(pin).toHaveValue("12");
    await user.keyboard("{Backspace}");
    expect(pin).toHaveValue("1");
  });

  it("leaves modifier shortcuts alone while global PIN capture is active", async () => {
    const user = userEvent.setup();
    render(<LoginScreen staff={staff} />);
    const pin = screen.getByLabelText("PIN de 4 dígitos");
    await user.keyboard("{Control>}1{/Control}{Alt>}2{/Alt}{Meta>}3{/Meta}");
    expect(pin).toHaveValue("");
    await user.keyboard("4");
    expect(pin).toHaveValue("4");
  });

  it("reports an incorrect PIN beside the field and permits a retry", async () => {
    const user = userEvent.setup();
    mutation.mutateAsync.mockResolvedValue({ ok: false, code: "invalid_credentials", message: "PIN incorrecto, intenta de nuevo." });
    render(<LoginScreen staff={staff} />);
    const pin = screen.getByLabelText("PIN de 4 dígitos");
    await user.type(pin, "1234");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(mutation.mutateAsync).toHaveBeenCalledWith({ staffId: "ana", pin: "1234" });
    expect(await screen.findByRole("alert")).toHaveTextContent("PIN incorrecto");
    expect(pin).toHaveValue("");
    expect(pin).toHaveAttribute("aria-invalid", "true");
    await user.type(pin, "9");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("submits a correct PIN without displaying an error and disables controls while pending", async () => {
    const user = userEvent.setup();
    mutation.mutateAsync.mockResolvedValue({ ok: true, session: { staffId: "ana", name: "Ana", role: "encargado" } });
    const view = render(<LoginScreen staff={staff} />);
    const pin = screen.getByLabelText("PIN de 4 dígitos");
    await user.type(pin, "4837");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    await waitFor(() => expect(mutation.mutateAsync).toHaveBeenCalledWith({ staffId: "ana", pin: "4837" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    mutation.isPending = true;
    view.rerender(<LoginScreen staff={staff} />);
    expect(pin).toBeDisabled();
    expect(screen.getByRole("button", { name: "Iniciando sesión…" })).toBeDisabled();
  });

  it("announces an unexpected request failure", async () => {
    const user = userEvent.setup();
    mutation.mutateAsync.mockRejectedValue(new Error("offline"));
    render(<LoginScreen staff={staff} />);
    await user.type(screen.getByLabelText("PIN de 4 dígitos"), "4837");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo iniciar sesión");
  });
});
