import type { Currency, Rates } from "@/lib/money/money.schema";
import { convert } from "@/lib/money/money.convert";

import type { Transaction } from "./transactions.schema";

export const ORIGINAL_CURRENCY = "ORIGINAL" as const;
export type DisplayCurrency = Currency | typeof ORIGINAL_CURRENCY;

export function resolveDisplayAmount(
  transaction: Transaction,
  displayCurrency: DisplayCurrency,
  rates: Rates | undefined,
): { amount: number; currency: Currency } {
  if (displayCurrency === ORIGINAL_CURRENCY || !rates) {
    return { amount: transaction.amount, currency: transaction.currency };
  }
  return {
    amount: convert(transaction.amount, transaction.currency, displayCurrency, rates),
    currency: displayCurrency,
  };
}
