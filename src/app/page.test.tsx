import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Catalog } from "@/features/catalog/types";
import { catalogStorageKey } from "@/features/catalog/cache";
import { resetCatalogReadService, setCatalogReadService } from "@/features/catalog/service";
import HomePage from "./(pos)/page";

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><HomePage /></QueryClientProvider>);
}

describe("catalog page", () => {
  beforeEach(() => {
    window.localStorage.clear();
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
    resetCatalogReadService();
    window.localStorage.clear();
    if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, "showModal", originalShowModal);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
    if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, "close", originalClose);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
  });

  it("loads the mock catalog, filters categories, and prepares a drink without special instructions", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByText("Cargando menú…")).toBeInTheDocument();
    const categories = await screen.findByRole("group", { name: "Categorías del menú" });
    expect(within(categories).getByRole("button", { name: "Esquites" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Esquite tradicional, desde/ })).toBeInTheDocument();
    await user.click(within(categories).getByRole("button", { name: "Bebidas" }));
    expect(within(categories).getByRole("button", { name: "Bebidas" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: /Esquite tradicional, desde/ })).not.toBeInTheDocument();
    const water = screen.getByRole("button", { name: /Agua natural, / });
    await user.click(water);
    const dialog = screen.getByRole("dialog", { name: "Agua natural" });
    expect(within(dialog).getByRole("button", { name: /Preparar/ })).toBeEnabled();
    expect(within(dialog).queryByRole("textbox", { name: "Indicación especial" })).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Aumentar cantidad" }));
    expect(within(dialog).getByRole("button", { name: /Preparar/ })).toHaveTextContent(/30[.,]00/);
    await user.click(within(dialog).getByRole("button", { name: /Preparar/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Configuración lista");
    expect(water).toHaveFocus();
  });

  it("retains special instructions for food products, including food listed under Bebidas", async () => {
    const user = userEvent.setup();
    renderPage();
    const categories = await screen.findByRole("group", { name: "Categorías del menú" });
    await user.click(screen.getByRole("button", { name: /Esquite tradicional, desde/ }));
    const esquiteDialog = screen.getByRole("dialog", { name: "Esquite tradicional" });
    await user.type(within(esquiteDialog).getByRole("textbox", { name: "Indicación especial" }), "Poco limón");
    await user.click(within(esquiteDialog).getByRole("button", { name: /Preparar/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Poco limón");

    await user.click(within(categories).getByRole("button", { name: "Bebidas" }));
    await user.click(screen.getByRole("button", { name: /Bolsa de sabritas, / }));
    const chipsDialog = screen.getByRole("dialog", { name: "Bolsa de sabritas" });
    expect(within(chipsDialog).getByRole("textbox", { name: "Indicación especial" })).toBeInTheDocument();
  });

  it("blocks required choices and reflects size and paid options in the total", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole("group", { name: "Categorías del menú" });
    await user.click(screen.getByRole("button", { name: /Sabriesquite, desde/ }));
    const dialog = screen.getByRole("dialog", { name: "Sabriesquite" });
    const prepare = within(dialog).getByRole("button", { name: /Preparar/ });
    expect(prepare).toBeDisabled();
    expect(within(dialog).getByText("Elige una opción obligatoria.")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: /Tostitos Verdes/ })).toBeDisabled();
    await user.click(within(dialog).getByRole("button", { name: /20 oz/ }));
    expect(within(dialog).getByRole("button", { name: /Tostitos Verdes/ })).toBeEnabled();
    await user.click(within(dialog).getByRole("button", { name: /Tostitos Verdes/ }));
    expect(prepare).toBeEnabled();
    expect(prepare).toHaveTextContent(/90[.,]00/);
    await user.click(within(dialog).getByRole("button", { name: /^Tocino, / }));
    expect(prepare).toHaveTextContent(/130[.,]00/);
    await user.click(within(dialog).getByRole("button", { name: /12 oz/ }));
    expect(within(dialog).getByRole("button", { name: /Tostitos Verdes/ })).toBeDisabled();
    expect(prepare).toBeDisabled();
  });

  it("requires two distinct Supremo choices before preparing", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole("group", { name: "Categorías del menú" });
    await user.click(screen.getByRole("button", { name: "Especiales" }));
    await user.click(screen.getByRole("button", { name: /Charolazo Supremo, / }));
    const dialog = screen.getByRole("dialog", { name: "Charolazo Supremo" });
    const wholeChips = within(dialog).getByRole("group", { name: /Sabritas enteras/ });
    const prepare = within(dialog).getByRole("button", { name: /Preparar/ });
    expect(prepare).toBeDisabled();
    await user.click(within(wholeChips).getByRole("button", { name: "Takis" }));
    expect(prepare).toBeDisabled();
    await user.click(within(wholeChips).getByRole("button", { name: "Ruffles" }));
    expect(prepare).toBeEnabled();
    expect(within(wholeChips).getByRole("button", { name: "Chips" })).toBeDisabled();
  });

  it("shows empty categories and recovers from a read error", async () => {
    setCatalogReadService({ readCatalog: vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ categories: [], products: [] } satisfies Catalog) });
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo cargar el menú");
    await user.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByText("El menú aún no tiene categorías.")).toBeInTheDocument();
  });

  it("shows an empty state for a category with no products", async () => {
    setCatalogReadService({ readCatalog: async () => ({ categories: [{ id: "esquites", name: "Esquites" }], products: [] }) });
    renderPage();
    expect(await screen.findByText("No hay productos en esta categoría.")).toBeInTheDocument();
  });

  it("keeps the last fetched menu available after remount when the catalog read fails", async () => {
    const readCatalog = vi.fn().mockResolvedValueOnce({
      categories: [{ id: "bebidas", name: "Bebidas" }],
      products: [],
    } satisfies Catalog).mockRejectedValueOnce(new Error("connection lost"));
    setCatalogReadService({ readCatalog });

    const firstPage = renderPage();
    expect(await screen.findByRole("group", { name: "Categorías del menú" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bebidas" })).toBeInTheDocument();
    firstPage.unmount();

    renderPage();
    expect(await screen.findByText(/Mostrando menú guardado en este dispositivo/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bebidas" })).toBeInTheDocument();
    expect(readCatalog).toHaveBeenCalledTimes(2);
  });

  it("refreshes a saved menu and removes its stale notice when the read recovers", async () => {
    const user = userEvent.setup();
    const readCatalog = vi.fn()
      .mockResolvedValueOnce({ categories: [{ id: "bebidas", name: "Bebidas" }], products: [] } satisfies Catalog)
      .mockRejectedValueOnce(new Error("connection lost"))
      .mockResolvedValueOnce({ categories: [{ id: "elotes", name: "Elotes" }], products: [] } satisfies Catalog);
    setCatalogReadService({ readCatalog });

    const firstPage = renderPage();
    await screen.findByRole("button", { name: "Bebidas" });
    firstPage.unmount();
    renderPage();
    expect(await screen.findByText(/Mostrando menú guardado en este dispositivo/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reintentar actualización" }));
    expect(await screen.findByRole("button", { name: "Elotes" })).toBeInTheDocument();
    expect(screen.queryByText(/Mostrando menú guardado en este dispositivo/)).not.toBeInTheDocument();
    expect(readCatalog).toHaveBeenCalledTimes(3);
  });

  it.each([
    ["malformed JSON", "{not-json"],
    ["invalid catalog data", JSON.stringify({
      schemaVersion: 1,
      savedAt: Date.now(),
      catalog: { categories: [{ id: "bebidas", name: "Bebidas" }], products: "invalid" },
    })],
  ])("does not show %s as a saved menu", async (_description, snapshot) => {
    window.localStorage.setItem(catalogStorageKey, snapshot);
    setCatalogReadService({ readCatalog: async () => { throw new Error("connection lost"); } });

    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo cargar el menú");
    expect(screen.queryByText(/Mostrando menú guardado en este dispositivo/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });
});
