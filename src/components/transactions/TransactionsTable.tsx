import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BANK_BADGE_CLASSES, BANK_LABELS } from "@/lib/banks/banks.constants";
import { formatDate } from "@/lib/date";
import { formatMoney } from "@/lib/money/money.format";
import type { Rates } from "@/lib/money/money.schema";
import { resolveDisplayAmount, type DisplayCurrency } from "@/lib/transactions/transactions.display";
import { TRANSACTION_COLUMN_LABELS } from "@/lib/transactions/transactions.columns";
import type { Transaction } from "@/lib/transactions/transactions.schema";
import { cn } from "@/lib/utils";

import { AuthorizedByTooltip } from "./AuthorizedByTooltip";

type Props = {
  rows: Transaction[];
  displayCurrency: DisplayCurrency;
  rates: Rates | undefined;
  onRowClick: (transaction: Transaction) => void;
};

export function TransactionsTable({ rows, displayCurrency, rates, onRowClick }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {TRANSACTION_COLUMN_LABELS.map((label) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((transaction) => {
            const display = resolveDisplayAmount(transaction, displayCurrency, rates);
            return (
              <TableRow
                key={transaction.id}
                onClick={() => onRowClick(transaction)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell className="font-medium tabular-nums whitespace-nowrap">
                  {formatMoney(display.amount, display.currency)}
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell className="text-muted-foreground">{transaction.category}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("font-normal", BANK_BADGE_CLASSES[transaction.bank])}
                  >
                    {BANK_LABELS[transaction.bank]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <AuthorizedByTooltip authorizer={transaction.authorizedBy} />
                </TableCell>
                <TableCell className="text-muted-foreground">{transaction.vendor}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
