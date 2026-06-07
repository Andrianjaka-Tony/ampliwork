import type { Transaction } from "@/lib/transactions/transactions.schema";

import type { AmexFile } from "../banks.schema";
import type { AuthorizerResolver } from "./resolver";

export function normalizeAmex(file: AmexFile, resolve: AuthorizerResolver): Transaction[] {
  return file.data.charges.map((charge): Transaction => ({
    id: charge.chargeId,
    date: charge.transactionDate,
    description: charge.memo,
    amount: Math.abs(charge.amountInCents) / 100,
    currency: charge.billingCurrency,
    type: charge.type === "payment" ? "credit" : "debit",
    category: charge.merchant.category,
    vendor: charge.merchant.name,
    bank: "amex",
    authorizedBy: resolve(charge.employee.name),
    source: charge,
  }));
}
