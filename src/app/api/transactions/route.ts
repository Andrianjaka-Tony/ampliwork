import { z } from "zod";
import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api/api.response";
import { transactionQuerySchema } from "@/lib/transactions/transactions.schema";
import { getTransactions, getTransactionsPage } from "@/lib/transactions/transactions.service";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const parsed = transactionQuerySchema.safeParse({
    bank: params.get("bank") ?? undefined,
    authorizedBy: params.get("authorizedBy") ?? undefined,
    type: params.get("type") ?? undefined,
    amount: params.get("amount") ?? undefined,
    maxAmount: params.get("maxAmount") ?? undefined,
    currency: params.get("currency") ?? undefined,
    fromDate: params.get("fromDate") ?? undefined,
    order: params.get("order") ?? undefined,
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
  });

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid query parameters.", z.flattenError(parsed.error));
  }

  try {
    // `?page=…` switches the response to a paginated envelope; otherwise the full list.
    if (params.get("page") !== null) {
      return ok(getTransactionsPage(parsed.data));
    }
    return ok(getTransactions(parsed.data));
  } catch {
    return fail("INTERNAL_ERROR", "Failed to load transactions.");
  }
}
