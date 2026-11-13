import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { getCurrentSession } from "@/features/session/service";

export default async function PosLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  return <AppShell session={session}>{children}</AppShell>;
}
