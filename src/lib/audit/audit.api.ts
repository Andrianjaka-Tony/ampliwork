import { apiFetch } from "@/lib/api/api.client";

import { auditSummarySchema, type AuditSummary } from "./audit.schema";

export function getAudit(signal?: AbortSignal): Promise<AuditSummary> {
  return apiFetch("/api/audit", { schema: auditSummarySchema, signal });
}
