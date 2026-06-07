import type { Transaction } from "@/lib/transactions/transactions.schema";

import type { BoaFile } from "../banks.schema";
import type { AuthorizerResolver } from "./resolver";

export function normalizeBoa(file: BoaFile, resolve: AuthorizerResolver): Transaction[] {
  return file.transactionList.map((tx): Transaction => ({
    id: tx.id,
    date: tx.transactionDate,
    description: tx.description,
    amount: Math.abs(tx.amount),
    currency: tx.currencyCode,
    type: tx.debitCreditMemo === "CREDIT" ? "credit" : "debit",
    category: tx.spendingCategory,
    vendor: tx.payee,
    bank: "boa",
    authorizedBy: resolve(tx.originator.name),
    source: tx,
  }));
}
