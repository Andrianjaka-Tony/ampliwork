import type { Currency, Rates } from "./money.schema";

export function convert(amount: number, from: Currency, to: Currency, rates: Rates): number {
  if (from === to) return amount;

  const fromRate = rates[from];
  const toRate = rates[to];
  if (fromRate === undefined || toRate === undefined) {
    throw new Error(`Missing exchange rate for ${fromRate === undefined ? from : to}.`);
  }

  return (amount * fromRate) / toRate;
}
