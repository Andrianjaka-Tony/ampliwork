import { fail, ok } from "@/lib/api/api.response";
import { getAuditSummary } from "@/lib/audit/audit.service";

/** GET /api/audit — spend-oversight summary (outliers + authorization concentration). */
export async function GET() {
  try {
    return ok(getAuditSummary());
  } catch {
    return fail("INTERNAL_ERROR", "Failed to compute audit summary.");
  }
}
