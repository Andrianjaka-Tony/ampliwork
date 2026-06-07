import { apiFetch } from "@/lib/api/api.client";

import { auditSummarySchema, type AuditSummary } from "./audit.schema";

/** GET /api/audit — spend-oversight summary. */
export function getAudit(signal?: AbortSignal): Promise<AuditSummary> {
  return apiFetch("/api/audit", { schema: auditSummarySchema, signal });
}
