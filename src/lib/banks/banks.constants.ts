import type { Bank } from "./banks.schema";

export const BANK_LABELS: Record<Bank, string> = {
  chase: "Chase",
  boa: "Bank of America",
  amex: "American Express",
};

export const BANK_OPTIONS: readonly Bank[] = ["chase", "boa", "amex"] as const;

export const BANK_BADGE_CLASSES: Record<Bank, string> = {
  chase:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  boa: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  amex: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
};
