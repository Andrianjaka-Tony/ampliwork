"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { downloadCsv, toCsv } from "@/lib/csv/csv.util";
import type { Rates } from "@/lib/money/money.schema";
import { getTransactions } from "@/lib/transactions/transactions.api";
import {
  buildTransactionCsvRow,
  TRANSACTION_COLUMN_LABELS,
} from "@/lib/transactions/transactions.columns";
import { resolveDisplayAmount, type DisplayCurrency } from "@/lib/transactions/transactions.display";
import type { TransactionQuery } from "@/lib/transactions/transactions.schema";

type Props = {
  query: TransactionQuery;
  displayCurrency: DisplayCurrency;
  rates: Rates | undefined;
  disabled?: boolean;
};

export function ExportCsvButton({ query, displayCurrency, rates, disabled }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);
    try {
      const transactions = await getTransactions(query);
      const rows = transactions.map((transaction) =>
        buildTransactionCsvRow(transaction, resolveDisplayAmount(transaction, displayCurrency, rates)),
      );
      downloadCsv("transactions.csv", toCsv([...TRANSACTION_COLUMN_LABELS], rows));
      toast.success(`Exported ${transactions.length} transactions to CSV.`);
    } catch {
      toast.error("Failed to export transactions.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={disabled || isExporting}>
      <Download className="size-4" />
      {isExporting ? "Exporting…" : "Export CSV"}
    </Button>
  );
}
