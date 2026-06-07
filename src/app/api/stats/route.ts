import { fail, ok } from "@/lib/api/api.response";
import { getStatsSummary } from "@/lib/stats/stats.service";

export async function GET() {
  try {
    return ok(getStatsSummary());
  } catch {
    return fail("INTERNAL_ERROR", "Failed to compute stats.");
  }
}
