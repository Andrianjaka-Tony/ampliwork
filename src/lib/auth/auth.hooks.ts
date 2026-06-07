"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/api.client";

import { login } from "./auth.api";
import { clearSession, getSession, setSession } from "./auth.storage";
import { sessionSchema, type LoginRequest, type PublicUser, type Session } from "./auth.schema";

export type SessionState = Session | null | undefined;

export function useLogin() {
  return useMutation<PublicUser, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (user) => {
      setSession(sessionSchema.parse(user));
    },
  });
}

export function useSession(): SessionState {
  const [session, setLocalSession] = useState<SessionState>(undefined);

  useEffect(() => {
    setLocalSession(getSession());
    const sync = () => setLocalSession(getSession());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return session;
}

export function useLogout(): () => void {
  const router = useRouter();
  return useCallback(() => {
    clearSession();
    router.replace("/login");
  }, [router]);
}
