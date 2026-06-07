"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { KpiCards } from "@/components/stats/KpiCards";
import { MoneyInOutChart } from "@/components/stats/MoneyInOutChart";
import { SpendByCategoryChart } from "@/components/stats/SpendByCategoryChart";
import { TopVendorsTable } from "@/components/stats/TopVendorsTable";
import { useStats } from "@/lib/stats/stats.hooks";

export default function StatsPage() {
  const { data, isLoading, isError, error } = useStats();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Stats</h1>
        <p className="text-muted-foreground text-sm">
          Company-wide spending across all banks, converted to USD.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      )}

      {isError && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-6 text-sm">
          {error.message}
        </div>
      )}

      {data && data.topVendors.length === 0 && (
        <div className="text-muted-foreground rounded-lg border p-10 text-center text-sm">
          No transactions to summarize yet.
        </div>
      )}

      {data && data.topVendors.length > 0 && (
        <>
          <KpiCards kpis={data.kpis} currency={data.currency} />

          <div className="grid gap-4 lg:grid-cols-2">
            <SpendByCategoryChart data={data.spendByCategory} currency={data.currency} />
            <MoneyInOutChart data={data.byMonth} currency={data.currency} />
          </div>

          <TopVendorsTable vendors={data.topVendors} currency={data.currency} />
        </>
      )}
    </div>
  );
}
