import type { Transaction } from "@/lib/transactions/transactions.schema";

import type { ChaseFile } from "../banks.schema";
import type { AuthorizerResolver } from "./resolver";

export function normalizeChase(file: ChaseFile, resolve: AuthorizerResolver): Transaction[] {
  return file.transactions.map((tx): Transaction => ({
    id: tx.transactionId,
    date: tx.transactionDate,
    description: tx.description,
    amount: Math.abs(tx.amount),
    currency: tx.currency,
    type: tx.transactionType === "CREDIT" ? "credit" : "debit",
    category: tx.categoryName,
    vendor: tx.merchantName,
    bank: "chase",
    authorizedBy: resolve(tx.initiatedBy.name),
    source: tx,
  }));
}
