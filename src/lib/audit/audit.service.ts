import { convert } from "@/lib/money/money.convert";
import { getRatesFile } from "@/lib/money/money.data";
import type { Currency } from "@/lib/money/money.schema";
import { getTransactions } from "@/lib/transactions/transactions.service";
import type { Transaction, TransactionAuthorizer } from "@/lib/transactions/transactions.schema";

import type { AuditSummary, Outlier } from "./audit.schema";

const BASE_CURRENCY: Currency = "USD";

const MIN_CATEGORY_SAMPLES = 8;

const IQR_MULTIPLIER = 1.5;

const MAX_OUTLIERS = 50;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = (sorted.length - 1) * p;
  const low = Math.floor(index);
  const high = Math.ceil(index);
  if (low === high) return sorted[low];
  return sorted[low] + (sorted[high] - sorted[low]) * (index - low);
}

export function getAuditSummary(): AuditSummary {
  const { rates } = getRatesFile();
  const toUsd = (tx: Transaction): number => convert(tx.amount, tx.currency, BASE_CURRENCY, rates);

  const debits = getTransactions().filter((tx) => tx.type === "debit");
  const totalSpend = debits.reduce((sum, tx) => sum + toUsd(tx), 0);

  const byCategory = new Map<string, Transaction[]>();
  for (const tx of debits) {
    const list = byCategory.get(tx.category) ?? [];
    list.push(tx);
    byCategory.set(tx.category, list);
  }

  const outliers: Outlier[] = [];
  for (const list of Array.from(byCategory.values())) {
    if (list.length < MIN_CATEGORY_SAMPLES) continue;

    const amounts = list.map(toUsd).sort((a, b) => a - b);
    const q1 = percentile(amounts, 0.25);
    const q3 = percentile(amounts, 0.75);
    const median = percentile(amounts, 0.5);
    const fence = q3 + IQR_MULTIPLIER * (q3 - q1);
    if (median <= 0) continue;

    for (const tx of list) {
      const usd = toUsd(tx);
      if (usd > fence) {
        outliers.push({
          transaction: tx,
          usdAmount: round2(usd),
          categoryMedian: round2(median),
          ratio: round2(usd / median),
        });
      }
    }
  }
  outliers.sort((a, b) => b.usdAmount - a.usdAmount);

  const byApprover = new Map<
    string,
    { authorizer: TransactionAuthorizer; total: number; count: number; largest: number }
  >();
  for (const tx of debits) {
    if (!tx.authorizedBy) continue;
    const usd = toUsd(tx);
    const entry = byApprover.get(tx.authorizedBy.id) ?? {
      authorizer: tx.authorizedBy,
      total: 0,
      count: 0,
      largest: 0,
    };
    entry.total += usd;
    entry.count += 1;
    entry.largest = Math.max(entry.largest, usd);
    byApprover.set(tx.authorizedBy.id, entry);
  }

  const approvers = Array.from(byApprover.values())
    .map((entry) => ({
      authorizer: entry.authorizer,
      total: round2(entry.total),
      count: entry.count,
      largest: round2(entry.largest),
      share: totalSpend > 0 ? entry.total / totalSpend : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const flaggedAmount = outliers.reduce((sum, outlier) => sum + outlier.usdAmount, 0);

  return {
    currency: BASE_CURRENCY,
    totals: {
      totalSpend: round2(totalSpend),
      flaggedCount: outliers.length,
      flaggedAmount: round2(flaggedAmount),
    },
    outliers: outliers.slice(0, MAX_OUTLIERS),
    approvers,
  };
}
