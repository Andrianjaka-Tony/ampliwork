import { z } from "zod";
import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api/api.response";
import { authenticate } from "@/lib/auth/auth.service";
import { loginRequestSchema } from "@/lib/auth/auth.schema";

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("BAD_REQUEST", "Request body must be valid JSON.");
  }

  const parsed = loginRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid credentials payload.", z.flattenError(parsed.error));
  }

  const user = authenticate(parsed.data);
  if (!user) {
    return fail("INVALID_CREDENTIALS", "Email or password is incorrect.");
  }

  return ok(user);
}
