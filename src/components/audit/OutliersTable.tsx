import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthorizedByTooltip } from "@/components/transactions/AuthorizedByTooltip";
import type { Outlier } from "@/lib/audit/audit.schema";
import { BANK_BADGE_CLASSES, BANK_LABELS } from "@/lib/banks/banks.constants";
import type { Currency } from "@/lib/money/money.schema";
import { formatMoney } from "@/lib/money/money.format";
import { cn } from "@/lib/utils";

export function OutliersTable({
  outliers,
  currency,
}: {
  outliers: Outlier[];
  currency: Currency;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Outlier transactions</CardTitle>
        <CardDescription>
          Debits well above their category&apos;s normal range (Q3 + 1.5×IQR), in {currency}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {outliers.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            No outlier transactions detected.
          </p>
        ) : (
          <ScrollArea className="h-105">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">vs median</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Authorized By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outliers.map(({ transaction, usdAmount, ratio }) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell className="text-muted-foreground">{transaction.category}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatMoney(usdAmount, currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-normal tabular-nums">
                        {ratio}×
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-normal", BANK_BADGE_CLASSES[transaction.bank])}
                      >
                        {BANK_LABELS[transaction.bank]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <AuthorizedByTooltip authorizer={transaction.authorizedBy} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
