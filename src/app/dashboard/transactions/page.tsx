"use client";

import { useEffect, useMemo, useState } from "react";

import type { Bank } from "@/lib/banks/banks.schema";
import { useRates } from "@/lib/money/money.hooks";
import { ORIGINAL_CURRENCY, type DisplayCurrency } from "@/lib/transactions/transactions.display";
import { useTransactionsPage } from "@/lib/transactions/transactions.hooks";
import type {
  Transaction,
  TransactionQuery,
  TransactionType,
} from "@/lib/transactions/transactions.schema";
import { useUsers } from "@/lib/users/users.hooks";

import Pagination from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportCsvButton } from "@/components/transactions/ExportCsvButton";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";

function toNumber(value: string): number | undefined {
  return value !== "" && Number.isFinite(Number(value)) ? Number(value) : undefined;
}

export default function TransactionsPage() {
  const [bank, setBank] = useState<Bank | "ALL">("ALL");
  const [authorizedBy, setAuthorizedBy] = useState<string | "ALL">("ALL");
  const [type, setType] = useState<TransactionType | "ALL">("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>(ORIGINAL_CURRENCY);

  const [selected, setSelected] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const serverQuery = useMemo<TransactionQuery>(() => {
    const min = toNumber(minAmount);
    const max = toNumber(maxAmount);
    const hasAmountFilter = min !== undefined || max !== undefined;
    return {
      bank: bank === "ALL" ? undefined : bank,
      authorizedBy: authorizedBy === "ALL" ? undefined : authorizedBy,
      type: type === "ALL" ? undefined : type,
      amount: min,
      maxAmount: max,
      currency:
        hasAmountFilter && displayCurrency !== ORIGINAL_CURRENCY ? displayCurrency : undefined,
      fromDate: fromDate || undefined,
      order: "desc",
    };
  }, [bank, authorizedBy, type, minAmount, maxAmount, displayCurrency, fromDate]);

  useEffect(() => setPage(1), [serverQuery]);

  const pageQuery = useMemo<TransactionQuery>(
    () => ({ ...serverQuery, page, pageSize }),
    [serverQuery, page, pageSize],
  );

  const transactionsQuery = useTransactionsPage(pageQuery);
  const ratesQuery = useRates();
  const usersQuery = useUsers();

  const items = transactionsQuery.data?.items ?? [];
  const total = transactionsQuery.data?.total ?? 0;
  const rates = ratesQuery.data?.rates;

  const isInitialLoading = transactionsQuery.isLoading;
  const isEmpty = !isInitialLoading && total === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-sm">
            {isInitialLoading ? "Loading…" : "Across all three bank accounts."}
          </p>
        </div>
        <ExportCsvButton
          query={serverQuery}
          displayCurrency={displayCurrency}
          rates={rates}
          disabled={isInitialLoading || total === 0}
        />
      </div>

      <TransactionFilters
        bank={bank}
        onBankChange={setBank}
        authorizedBy={authorizedBy}
        onAuthorizedByChange={setAuthorizedBy}
        users={usersQuery.data ?? []}
        type={type}
        onTypeChange={setType}
        displayCurrency={displayCurrency}
        onDisplayCurrencyChange={setDisplayCurrency}
        minAmount={minAmount}
        onMinAmountChange={setMinAmount}
        maxAmount={maxAmount}
        onMaxAmountChange={setMaxAmount}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
      />

      {isInitialLoading && (
        <div className="space-y-2 rounded-lg border p-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-full" />
          ))}
        </div>
      )}

      {transactionsQuery.isError && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-6 text-sm">
          {transactionsQuery.error.message}
        </div>
      )}

      {isEmpty && (
        <div className="text-muted-foreground rounded-lg border p-10 text-center text-sm">
          No transactions match the current filters.
        </div>
      )}

      {!isInitialLoading && !isEmpty && (
        <>
          <TransactionsTable
            rows={items}
            displayCurrency={displayCurrency}
            rates={rates}
            onRowClick={setSelected}
          />

          <Pagination
            total={total}
            page={page}
            pageSize={pageSize}
            itemLabel="transactions"
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      )}

      <TransactionModal
        transaction={selected}
        displayCurrency={displayCurrency}
        rates={rates}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
