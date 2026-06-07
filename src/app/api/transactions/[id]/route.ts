import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api/api.response";
import { getTransactionById } from "@/lib/transactions/transactions.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const transaction = getTransactionById(id);
  if (!transaction) {
    return fail("NOT_FOUND", `No transaction found with id "${id}".`);
  }

  return ok(transaction);
}
