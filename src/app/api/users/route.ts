import { fail, ok } from "@/lib/api/api.response";
import { getPublicUsers } from "@/lib/auth/auth.service";

export async function GET() {
  try {
    return ok(getPublicUsers());
  } catch {
    return fail("INTERNAL_ERROR", "Failed to load users.");
  }
}
