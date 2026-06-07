import { ShieldAlert, TriangleAlert, Wallet } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AuditSummary } from "@/lib/audit/audit.schema";
import { formatMoney } from "@/lib/money/money.format";

export function AuditSummaryCards({ summary }: { summary: AuditSummary }) {
  const { totals, approvers, currency } = summary;
  const topApprover = approvers[0];
  const flaggedShare = totals.totalSpend > 0 ? (totals.flaggedAmount / totals.totalSpend) * 100 : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Flagged transactions</CardDescription>
          <CardTitle className="text-2xl tabular-nums">{totals.flaggedCount}</CardTitle>
          <CardAction>
            <TriangleAlert className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs">
          {formatMoney(totals.flaggedAmount, currency)} · {flaggedShare.toFixed(1)}% of spend
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Top approver share</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {topApprover ? `${(topApprover.share * 100).toFixed(1)}%` : "—"}
          </CardTitle>
          <CardAction>
            <ShieldAlert className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs">
          {topApprover
            ? `${topApprover.authorizer.name} approved ${formatMoney(topApprover.total, currency)}`
            : "No approvals"}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total spend reviewed</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {formatMoney(totals.totalSpend, currency)}
          </CardTitle>
          <CardAction>
            <Wallet className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs">
          Across all banks, converted to {currency}
        </CardContent>
      </Card>
    </div>
  );
}
