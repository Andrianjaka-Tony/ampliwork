import { getRatesFile } from "@/lib/money/money.data";
import { convert } from "@/lib/money/money.convert";
import type { Currency } from "@/lib/money/money.schema";
import { getTransactions } from "@/lib/transactions/transactions.service";
import type { Transaction } from "@/lib/transactions/transactions.schema";

import type { CategoryTotal, MonthlyFlow, StatsSummary, VendorTotal } from "./stats.schema";

const BASE_CURRENCY: Currency = "USD";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function vendorKey(vendor: string): string {
  return vendor.trim().toLowerCase();
}

function isAllCaps(value: string): boolean {
  return value === value.toUpperCase() && value !== value.toLowerCase();
}

function pickDisplayName(current: string, candidate: string): string {
  return isAllCaps(current) && !isAllCaps(candidate) ? candidate : current;
}

function rankDescending<K extends string>(totals: Map<K, number>): Array<{ key: K; total: number }> {
  return Array.from(totals.entries())
    .map(([key, total]) => ({ key, total: round2(total) }))
    .sort((a, b) => b.total - a.total);
}

export function getStatsSummary(): StatsSummary {
  const transactions = getTransactions();
  const { rates } = getRatesFile();

  const toUsd = (transaction: Transaction): number =>
    convert(transaction.amount, transaction.currency, BASE_CURRENCY, rates);

  let cashIn = 0;
  let cashOut = 0;

  const spendByVendor = new Map<string, { display: string; total: number }>();
  const spendByCategory = new Map<string, number>();
  const flowByMonth = new Map<string, { cashIn: number; cashOut: number }>();
  const vendorKeys = new Set<string>();

  for (const transaction of transactions) {
    const usd = toUsd(transaction);
    const month = transaction.date.slice(0, 7);
    const flow = flowByMonth.get(month) ?? { cashIn: 0, cashOut: 0 };

    vendorKeys.add(vendorKey(transaction.vendor));

    if (transaction.type === "credit") {
      cashIn += usd;
      flow.cashIn += usd;
    } else {
      cashOut += usd;
      flow.cashOut += usd;

      const key = vendorKey(transaction.vendor);
      const entry = spendByVendor.get(key);
      spendByVendor.set(key, {
        display: entry ? pickDisplayName(entry.display, transaction.vendor) : transaction.vendor,
        total: (entry?.total ?? 0) + usd,
      });
      spendByCategory.set(transaction.category, (spendByCategory.get(transaction.category) ?? 0) + usd);
    }

    flowByMonth.set(month, flow);
  }

  const topVendors: VendorTotal[] = Array.from(spendByVendor.values())
    .map(({ display, total }) => ({ vendor: display, total: round2(total) }))
    .sort((a, b) => b.total - a.total);

  const categoryTotals: CategoryTotal[] = rankDescending(spendByCategory).map(({ key, total }) => ({
    category: key,
    total,
  }));

  const byMonth: MonthlyFlow[] = Array.from(flowByMonth.entries())
    .map(([month, flow]) => ({
      month,
      cashIn: round2(flow.cashIn),
      cashOut: round2(flow.cashOut),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    currency: BASE_CURRENCY,
    kpis: {
      cashIn: round2(cashIn),
      cashOut: round2(cashOut),
      netCashFlow: round2(cashIn - cashOut),
      vendorCount: vendorKeys.size,
      topVendor: topVendors[0] ?? null,
      topCategory: categoryTotals[0] ?? null,
    },
    topVendors,
    spendByCategory: categoryTotals,
    byMonth,
  };
}
