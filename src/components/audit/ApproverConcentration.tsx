import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ApproverStat } from "@/lib/audit/audit.schema";
import type { Currency } from "@/lib/money/money.schema";
import { formatMoney } from "@/lib/money/money.format";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ApproverConcentration({
  approvers,
  currency,
}: {
  approvers: ApproverStat[];
  currency: Currency;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorization concentration</CardTitle>
        <CardDescription>Share of total spend each person approved.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {approvers.map((approver) => (
          <div key={approver.authorizer.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">
                    {initials(approver.authorizer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{approver.authorizer.name}</div>
                  <div className="text-muted-foreground text-xs capitalize">
                    {approver.authorizer.role.replace("_", " ")}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium tabular-nums">
                  {formatMoney(approver.total, currency)}
                </div>
                <div className="text-muted-foreground text-xs tabular-nums">
                  {(approver.share * 100).toFixed(1)}% · {approver.count} tx
                </div>
              </div>
            </div>
            <Progress value={approver.share * 100} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
