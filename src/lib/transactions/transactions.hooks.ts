"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/api.client";

import { getTransaction, getTransactionsPage } from "./transactions.api";
import type { Transaction, TransactionPage, TransactionQuery } from "./transactions.schema";

export function useTransactionsPage(query: TransactionQuery) {
  return useQuery<TransactionPage, ApiError>({
    queryKey: ["transactions-page", query],
    queryFn: ({ signal }) => getTransactionsPage(query, signal),
    placeholderData: keepPreviousData,
  });
}

export function useTransaction(id: string | undefined) {
  return useQuery<Transaction, ApiError>({
    queryKey: ["transaction", id],
    queryFn: ({ signal }) => getTransaction(id as string, signal),
    enabled: Boolean(id),
  });
}
