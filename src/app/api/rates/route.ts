import { fail, ok } from "@/lib/api/api.response";
import { getRatesFile } from "@/lib/money/money.data";

export async function GET() {
  try {
    return ok(getRatesFile());
  } catch {
    return fail("INTERNAL_ERROR", "Failed to load exchange rates.");
  }
}
