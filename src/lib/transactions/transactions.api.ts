import { apiFetch } from "@/lib/api/api.client";

import {
  transactionListSchema,
  transactionPageSchema,
  transactionQuerySchema,
  transactionSchema,
  type Transaction,
  type TransactionPage,
  type TransactionQuery,
} from "./transactions.schema";

function toQueryString(query: TransactionQuery): string {
  const params = new URLSearchParams();
  if (query.bank) params.set("bank", query.bank);
  if (query.authorizedBy) params.set("authorizedBy", query.authorizedBy);
  if (query.type) params.set("type", query.type);
  if (query.amount !== undefined) params.set("amount", String(query.amount));
  if (query.maxAmount !== undefined) params.set("maxAmount", String(query.maxAmount));
  if (query.currency) params.set("currency", query.currency);
  if (query.fromDate) params.set("fromDate", query.fromDate);
  if (query.order) params.set("order", query.order);
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.pageSize !== undefined) params.set("pageSize", String(query.pageSize));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function getTransactions(
  query: TransactionQuery = {},
  signal?: AbortSignal,
): Promise<Transaction[]> {
  const parsed = transactionQuerySchema.parse(query);

  return apiFetch(`/api/transactions${toQueryString(parsed)}`, {
    schema: transactionListSchema,
    signal,
  });
}

export function getTransactionsPage(
  query: TransactionQuery,
  signal?: AbortSignal,
): Promise<TransactionPage> {
  const parsed = transactionQuerySchema.parse({ page: 1, pageSize: 10, ...query });

  return apiFetch(`/api/transactions${toQueryString(parsed)}`, {
    schema: transactionPageSchema,
    signal,
  });
}

export function getTransaction(id: string, signal?: AbortSignal): Promise<Transaction> {
  return apiFetch(`/api/transactions/${encodeURIComponent(id)}`, {
    schema: transactionSchema,
    signal,
  });
}
