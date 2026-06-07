import { BANK_LABELS } from "@/lib/banks/banks.constants";
import { formatMoney } from "@/lib/money/money.format";
import type { Currency } from "@/lib/money/money.schema";

import type { Transaction } from "./transactions.schema";

export const TRANSACTION_COLUMN_LABELS = [
  "Description",
  "Amount",
  "Date",
  "Category",
  "Bank Account",
  "Authorized By",
  "Vendor",
] as const;

export function buildTransactionCsvRow(
  transaction: Transaction,
  display: { amount: number; currency: Currency },
): string[] {
  return [
    transaction.description,
    formatMoney(display.amount, display.currency),
    transaction.date,
    transaction.category,
    BANK_LABELS[transaction.bank],
    transaction.authorizedBy?.name ?? "—",
    transaction.vendor,
  ];
}
