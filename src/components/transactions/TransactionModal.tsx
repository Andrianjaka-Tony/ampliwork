"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BANK_BADGE_CLASSES, BANK_LABELS } from "@/lib/banks/banks.constants";
import { formatDate } from "@/lib/date";
import { formatMoney } from "@/lib/money/money.format";
import type { Rates } from "@/lib/money/money.schema";
import {
  resolveDisplayAmount,
  type DisplayCurrency,
} from "@/lib/transactions/transactions.display";
import { TRANSACTION_TYPE_BADGE_CLASSES } from "@/lib/transactions/transactions.constants";
import type { Transaction } from "@/lib/transactions/transactions.schema";
import { cn } from "@/lib/utils";

type Props = {
  transaction: Transaction | null;
  displayCurrency: DisplayCurrency;
  rates: Rates | undefined;
  onClose: () => void;
};

const ACRONYMS = new Set(["id", "url", "iban", "usd", "eur", "gbp", "cad"]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T/;

/** "transactionId" → "Transaction ID", "transactionDate" → "Transaction date". */
function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return lower;
    })
    .join(" ");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-US");
  if (typeof value === "string") {
    if (ISO_DATE.test(value)) return formatDate(value);
    if (ISO_DATETIME.test(value)) {
      return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    }
    return value;
  }
  return JSON.stringify(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function DataList({ data, top = true }: { data: Record<string, unknown>; top?: boolean }) {
  return (
    <dl className={cn(top ? "divide-border divide-y" : "space-y-1")}>
      {Object.entries(data).map(([key, value]) => {
        const label = humanizeKey(key);
        if (isPlainObject(value)) {
          return (
            <div key={key} className={cn(top && "px-3 py-2")}>
              <div className="font-medium">{label}</div>
              <div className="mt-2">
                <DataList data={value} top={false} />
              </div>
            </div>
          );
        }
        return (
          <div key={key} className={cn("flex justify-between gap-4", top && "px-3 py-2")}>
            <dt className="text-muted-foreground shrink-0">{label}</dt>
            <dd className="min-w-0 text-right wrap-break-word">{formatValue(value)}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-0.5 text-sm wrap-break-word">{value}</dd>
    </div>
  );
}

export function TransactionModal({ transaction, displayCurrency, rates, onClose }: Props) {
  const display = transaction ? resolveDisplayAmount(transaction, displayCurrency, rates) : null;
  const source =
    transaction && isPlainObject(transaction.source)
      ? transaction.source
      : ({} as Record<string, unknown>);

  return (
    <Dialog open={transaction !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        {transaction && display && (
          <>
            <DialogHeader>
              <DialogTitle>{transaction.description}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("font-normal", BANK_BADGE_CLASSES[transaction.bank])}
                >
                  {BANK_LABELS[transaction.bank]}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("font-normal capitalize", TRANSACTION_TYPE_BADGE_CLASSES[transaction.type])}
                >
                  {transaction.type}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <dl className="grid grid-cols-2 gap-4">
              <Field label="Amount" value={formatMoney(display.amount, display.currency)} />
              <Field
                label="Original Amount"
                value={formatMoney(transaction.amount, transaction.currency)}
              />
              <Field label="Date" value={formatDate(transaction.date)} />
              <Field label="Category" value={transaction.category} />
              <Field label="Vendor" value={transaction.vendor} />
              <Field
                label="Authorized By"
                value={
                  transaction.authorizedBy ? (
                    <span>
                      {transaction.authorizedBy.name}
                      <span className="text-muted-foreground block text-xs break-all">
                        {transaction.authorizedBy.email}
                      </span>
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
            </dl>

            <Separator />

            <div>
              <h3 className="text-muted-foreground mb-2 text-xs font-medium">Bank data</h3>
              <ScrollArea className="h-56 rounded-md border">
                <DataList data={source} />
              </ScrollArea>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
