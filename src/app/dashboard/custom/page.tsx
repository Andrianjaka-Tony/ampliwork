"use client";

import { ApproverConcentration } from "@/components/audit/ApproverConcentration";
import { AuditSummaryCards } from "@/components/audit/AuditSummaryCards";
import { OutliersTable } from "@/components/audit/OutliersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudit } from "@/lib/audit/audit.hooks";

export default function CustomPage() {
  const { data, isLoading, isError, error } = useAudit();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Spend Oversight</h1>
        <p className="text-muted-foreground text-sm">
          Transactions and approvals that warrant a closer look — leadership only.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      )}

      {isError && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-6 text-sm">
          {error.message}
        </div>
      )}

      {data && (
        <>
          <AuditSummaryCards summary={data} />
          <OutliersTable outliers={data.outliers} currency={data.currency} />
          <ApproverConcentration approvers={data.approvers} currency={data.currency} />
        </>
      )}
    </div>
  );
}
