import { useMutation, useQuery } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getQueryClient } from "@/lib/query-client";
import { Providers } from "./providers";

function QueryConsumer({ load }: { load: () => Promise<string> }) {
  const query = useQuery({ queryKey: ["provider-result"], queryFn: load });
  return <p>{query.data ?? "Cargando"}</p>;
}

function MutationConsumer({ save }: { save: () => Promise<void> }) {
  const mutation = useMutation({ mutationFn: save });
  return (
    <>
      <button onClick={() => mutation.mutate()}>Guardar</button>
      {mutation.error && <p role="alert">{mutation.error.message}</p>}
    </>
  );
}

describe("application providers", () => {
  beforeEach(() => getQueryClient().clear());
  afterEach(() => getQueryClient().clear());

  it("keeps fresh browser data available when the provider remounts", async () => {
    const load = vi.fn().mockResolvedValue("Resultado disponible");
    const firstRender = render(<Providers><QueryConsumer load={load} /></Providers>);
    expect(await screen.findByText("Resultado disponible")).toBeInTheDocument();

    firstRender.unmount();
    render(<Providers><QueryConsumer load={load} /></Providers>);

    expect(screen.getByText("Resultado disponible")).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("reports mutation failures without automatically repeating a write", async () => {
    const user = userEvent.setup();
    const save = vi.fn().mockRejectedValue(new Error("No se pudo guardar"));
    render(<Providers><MutationConsumer save={save} /></Providers>);

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => expect(screen.getByRole("alert"))
      .toHaveTextContent("No se pudo guardar"));
    expect(save).toHaveBeenCalledTimes(1);
  });
});
