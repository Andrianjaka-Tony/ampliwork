"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/api.client";

import { getRates } from "./money.api";
import type { RatesFile } from "./money.schema";

export function useRates() {
  return useQuery<RatesFile, ApiError>({
    queryKey: ["rates"],
    queryFn: ({ signal }) => getRates(signal),
    staleTime: Infinity,
  });
}
