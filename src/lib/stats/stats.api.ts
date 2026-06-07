import { apiFetch } from "@/lib/api/api.client";

import { statsSummarySchema, type StatsSummary } from "./stats.schema";

export function getStats(signal?: AbortSignal): Promise<StatsSummary> {
  return apiFetch("/api/stats", { schema: statsSummarySchema, signal });
}
