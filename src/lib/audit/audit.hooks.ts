"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/api.client";

import { getAudit } from "./audit.api";
import type { AuditSummary } from "./audit.schema";

export function useAudit() {
  return useQuery<AuditSummary, ApiError>({
    queryKey: ["audit"],
    queryFn: ({ signal }) => getAudit(signal),
  });
}
