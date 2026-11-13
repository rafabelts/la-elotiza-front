import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentSession } from "@/features/session/service";
import { canManageTeam } from "@/features/session/validation";

export default async function TeamLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  if (!canManageTeam(session)) redirect("/");
  return children;
}
