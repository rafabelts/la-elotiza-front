"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignInError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-8">
      <Card as="section" aria-labelledby="signin-error-title" className="w-full max-w-90 text-center">
        <h1 id="signin-error-title" className="text-xl font-extrabold">No se pudo cargar el inicio de sesión</h1>
        <p role="alert" className="mt-3 text-sm text-muted">Inténtalo de nuevo.</p>
        <Button className="mt-5" onClick={reset}>Reintentar</Button>
      </Card>
    </main>
  );
}
