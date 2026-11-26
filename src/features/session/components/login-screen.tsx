"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useSignIn } from "@/features/session/use-session-mutations";
import type { StaffChoice } from "@/features/session/types";

type LoginScreenProps = { staff: readonly StaffChoice[] };

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export function LoginScreen({ staff }: LoginScreenProps) {
  const [staffId, setStaffId] = useState(staff[0]?.id ?? "");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const pending = signIn.isPending;

  function changePin(next: string) {
    setPin(next.replace(/\D/g, "").slice(0, 4));
    setError("");
  }

  function appendDigit(digit: string) {
    setPin((current) => (current + digit).slice(0, 4));
    setError("");
  }

  function removeDigit() {
    setPin((current) => current.slice(0, -1));
    setError("");
  }

  useEffect(() => {
    function handleViewKeyDown(event: KeyboardEvent) {
      if (pending || staff.length === 0 || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target instanceof HTMLTextAreaElement ||
          (target instanceof HTMLInputElement && target.type !== "radio"))
      ) return;

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        setPin((current) => (current + event.key).slice(0, 4));
        setError("");
      } else if (event.key === "Backspace") {
        event.preventDefault();
        setPin((current) => current.slice(0, -1));
        setError("");
      }
    }

    document.addEventListener("keydown", handleViewKeyDown);
    return () => document.removeEventListener("keydown", handleViewKeyDown);
  }, [pending, staff.length]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!staffId || pin.length !== 4 || pending) return;
    try {
      const result = await signIn.mutateAsync({ staffId, pin });
      if (!result.ok) {
        setPin("");
        setError(result.message);
      }
    } catch {
      setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
    }
  }

  return (
    <main className="relative grid min-h-dvh place-items-center bg-background px-4 py-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 grid h-1 grid-cols-3">
        <span className="bg-brand" /><span className="bg-elote" /><span className="bg-maize" />
      </div>
      <div className="w-full max-w-90 text-center">
        <Image src="/logo-elotiza.png" alt="La Elotiza" width={72} height={72} className="mx-auto size-18 rounded-full object-cover" />
        <h1 className="mt-3 text-[1.375rem] font-extrabold tracking-[-0.01em]">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-muted">¿Quién atiende hoy?</p>

        {staff.length === 0 ? (
          <p role="status" className="mt-8 rounded-card border border-line bg-surface p-5 text-sm text-muted">
            No hay personas disponibles para iniciar sesión.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-7 flex flex-col items-center gap-5">
            <fieldset className="w-full">
              <legend className="mb-3 w-full text-sm font-semibold text-muted">Selecciona tu nombre</legend>
              <div className="flex flex-wrap justify-center gap-2">
                {staff.map((person) => (
                  <label key={person.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="staff"
                      value={person.id}
                      checked={staffId === person.id}
                      onChange={() => { setStaffId(person.id); setPin(""); setError(""); }}
                      disabled={pending}
                      className="peer sr-only"
                    />
                    <span className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-surface peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-deep">
                      {person.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="w-full max-w-60 text-left">
              <Field
                id="session-pin"
                label="PIN de 4 dígitos"
                hint="Usa el teclado físico o toca los números."
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={pin}
                onChange={(event) => changePin(event.target.value)}
                disabled={pending}
                error={error || undefined}
                className="text-center text-xl font-bold tracking-[0.4em]"
              />
            </div>

            <div aria-label="Teclado numérico" className="grid grid-cols-3 gap-3">
              {keypad.map((digit) => (
                <button key={digit} type="button" disabled={pending || pin.length === 4} onClick={() => appendDigit(digit)} className="session-key">{digit}</button>
              ))}
              <span aria-hidden="true" />
              <button type="button" disabled={pending || pin.length === 4} onClick={() => appendDigit("0")} className="session-key">0</button>
              <button type="button" aria-label="Borrar último dígito" disabled={pending || pin.length === 0} onClick={removeDigit} className="session-key">⌫</button>
            </div>
            <Button type="submit" size="large" className="w-full max-w-60" disabled={pending || pin.length !== 4}>
              {pending ? "Iniciando sesión…" : "Iniciar sesión"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
