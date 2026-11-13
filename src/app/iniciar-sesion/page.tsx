import { redirect } from "next/navigation";
import { LoginScreen } from "@/features/session/components/login-screen";
import { getCurrentSession, listStaffChoices } from "@/features/session/service";

export default async function SignInPage() {
  const session = await getCurrentSession();
  if (session) redirect("/");
  const staff = await listStaffChoices();
  return <LoginScreen staff={staff} />;
}
