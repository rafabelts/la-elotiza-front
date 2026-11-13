"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signInAction, signOutAction } from "./actions";

export function useSignIn() {
  const router = useRouter();
  return useMutation({
    mutationFn: signInAction,
    onSuccess(result) {
      if (result.ok) {
        router.replace("/");
        router.refresh();
      }
    },
  });
}

export function useSignOut() {
  const router = useRouter();
  return useMutation({
    mutationFn: signOutAction,
    onSuccess() {
      router.replace("/iniciar-sesion");
      router.refresh();
    },
  });
}
