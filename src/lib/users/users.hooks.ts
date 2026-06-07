"use client";

import { useQuery } from "@tanstack/react-query";

import type { PublicUser } from "@/lib/auth/auth.schema";
import type { ApiError } from "@/lib/api/api.client";

import { getUsers } from "./users.api";

export function useUsers() {
  return useQuery<PublicUser[], ApiError>({
    queryKey: ["users"],
    queryFn: ({ signal }) => getUsers(signal),
    staleTime: Infinity,
  });
}
