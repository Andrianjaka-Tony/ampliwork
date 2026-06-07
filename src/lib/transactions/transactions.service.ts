import { getUsers } from "@/lib/auth/auth.data";
import { getAllBankFiles } from "@/lib/banks/banks.data";
import { normalizeBanks, type AuthorizerResolver } from "@/lib/banks/normalize";
import { convert } from "@/lib/money/money.convert";
import { getRatesFile } from "@/lib/money/money.data";

import {
  transactionAuthorizerSchema,
  type Transaction,
  type TransactionPage,
  type TransactionQuery,
} from "./transactions.schema";

function buildResolver(): AuthorizerResolver {
  const byName = new Map(
    getUsers().map((user) => [
      user.name.trim().toLowerCase(),
      transactionAuthorizerSchema.parse(user),
    ]),
  );

  return (name) => (name ? byName.get(name.trim().toLowerCase()) ?? null : null);
}

let cache: Transaction[] | null = null;

function getAllTransactions(): Transaction[] {
  return (cache ??= normalizeBanks(getAllBankFiles(), buildResolver()));
}

function filterAndSort(query: TransactionQuery): Transaction[] {
  const { amount: min, maxAmount: max, currency } = query;
  const hasAmountFilter = min !== undefined || max !== undefined;

  const rates = hasAmountFilter && currency ? getRatesFile().rates : undefined;

  const result = getAllTransactions().filter((tx) => {
    if (query.bank && tx.bank !== query.bank) return false;
    if (query.authorizedBy && tx.authorizedBy?.id !== query.authorizedBy) return false;
    if (query.type && tx.type !== query.type) return false;
    if (query.fromDate && tx.date < query.fromDate) return false;
    if (hasAmountFilter) {
      const amount = rates && currency ? convert(tx.amount, tx.currency, currency, rates) : tx.amount;
      if (min !== undefined && amount < min) return false;
      if (max !== undefined && amount > max) return false;
    }
    return true;
  });

  const order = query.order ?? "asc";
  return result.sort((a, b) =>
    order === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date),
  );
}

export function getTransactions(query: TransactionQuery = {}): Transaction[] {
  return filterAndSort(query);
}

export function getTransactionsPage(query: TransactionQuery): TransactionPage {
  const all = filterAndSort(query);
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const start = (page - 1) * pageSize;

  return {
    items: all.slice(start, start + pageSize),
    total: all.length,
    page,
    pageSize,
  };
}

export function getTransactionById(id: string): Transaction | null {
  return getAllTransactions().find((tx) => tx.id === id) ?? null;
}
