import { ArrowDownRight, Wallet } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Currency } from "@/lib/money/money.schema";
import { formatMoney } from "@/lib/money/money.format";
import type { StatsKpis } from "@/lib/stats/stats.schema";
import { cn } from "@/lib/utils";

export function KpiCards({ kpis, currency }: { kpis: StatsKpis; currency: Currency }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardDescription>Net Cash Flow</CardDescription>
          <CardTitle
            className={cn(
              "text-2xl tabular-nums",
              kpis.netCashFlow < 0 && "text-destructive",
            )}
          >
            {formatMoney(kpis.netCashFlow, currency)}
          </CardTitle>
          <CardAction>
            <Wallet className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs">
          In {formatMoney(kpis.cashIn, currency)} · Out {formatMoney(kpis.cashOut, currency)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total Cash Out</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {formatMoney(kpis.cashOut, currency)}
          </CardTitle>
          <CardAction>
            <ArrowDownRight className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs">
          Across {kpis.vendorCount} vendors
          {kpis.topCategory ? ` · Top: ${kpis.topCategory.category}` : ""}
        </CardContent>
      </Card>
    </div>
  );
}
