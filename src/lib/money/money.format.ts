import type { Currency } from "./money.schema";

const NUMBER_FORMAT = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(amount: number, currency: Currency): string {
  return `${currency} $${NUMBER_FORMAT.format(amount)}`;
}

const COMPACT_FORMAT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCompactMoney(amount: number): string {
  return `$${COMPACT_FORMAT.format(amount)}`;
}
