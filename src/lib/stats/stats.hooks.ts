"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/api.client";

import { getStats } from "./stats.api";
import type { StatsSummary } from "./stats.schema";

export function useStats() {
  return useQuery<StatsSummary, ApiError>({
    queryKey: ["stats"],
    queryFn: ({ signal }) => getStats(signal),
  });
}
