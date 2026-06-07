import { BANK_LABELS, BANK_OPTIONS } from "@/lib/banks/banks.constants";
import type { Bank } from "@/lib/banks/banks.schema";
import { currencySchema } from "@/lib/money/money.schema";
import { ORIGINAL_CURRENCY, type DisplayCurrency } from "@/lib/transactions/transactions.display";
import { transactionTypeSchema, type TransactionType } from "@/lib/transactions/transactions.schema";
import type { PublicUser } from "@/lib/auth/auth.schema";
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  bank: Bank | "ALL";
  onBankChange: (value: Bank | "ALL") => void;
  authorizedBy: string | "ALL";
  onAuthorizedByChange: (value: string | "ALL") => void;
  users: PublicUser[];
  type: TransactionType | "ALL";
  onTypeChange: (value: TransactionType | "ALL") => void;
  displayCurrency: DisplayCurrency;
  onDisplayCurrencyChange: (value: DisplayCurrency) => void;
  minAmount: string;
  onMinAmountChange: (value: string) => void;
  maxAmount: string;
  onMaxAmountChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
};

const numberInputClass =
  "w-24 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-muted-foreground text-xs">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function TransactionFilters({
  bank,
  onBankChange,
  authorizedBy,
  onAuthorizedByChange,
  users,
  type,
  onTypeChange,
  displayCurrency,
  onDisplayCurrencyChange,
  minAmount,
  onMinAmountChange,
  maxAmount,
  onMaxAmountChange,
  fromDate,
  onFromDateChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Field label="Bank" htmlFor="filter-bank">
        <Select value={bank} onValueChange={(value) => onBankChange(value as Bank | "ALL")}>
          <SelectTrigger id="filter-bank" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All banks</SelectItem>
            {BANK_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {BANK_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Authorized By" htmlFor="filter-authorized-by">
        <Select value={authorizedBy} onValueChange={onAuthorizedByChange}>
          <SelectTrigger id="filter-authorized-by" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Everyone</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Type" htmlFor="filter-type">
        <Select value={type} onValueChange={(value) => onTypeChange(value as TransactionType | "ALL")}>
          <SelectTrigger id="filter-type" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            {transactionTypeSchema.options.map((option) => (
              <SelectItem key={option} value={option} className="capitalize">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Amount" htmlFor="filter-min-amount">
        <div className="flex items-center gap-1.5">
          <Input
            id="filter-min-amount"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Min"
            value={minAmount}
            onChange={(event) => onMinAmountChange(event.target.value)}
            className={numberInputClass}
            aria-label="Minimum amount"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Max"
            value={maxAmount}
            onChange={(event) => onMaxAmountChange(event.target.value)}
            className={numberInputClass}
            aria-label="Maximum amount"
          />
        </div>
      </Field>

      <Field label="Show Currency In" htmlFor="filter-currency">
        <Select
          value={displayCurrency}
          onValueChange={(value) => onDisplayCurrencyChange(value as DisplayCurrency)}
        >
          <SelectTrigger id="filter-currency" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ORIGINAL_CURRENCY}>Original</SelectItem>
            {currencySchema.options.map((code) => (
              <SelectItem key={code} value={code}>
                All {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="From Date" htmlFor="filter-from-date">
        <DatePicker
          id="filter-from-date"
          value={fromDate}
          onChange={onFromDateChange}
          placeholder="Any date"
          className="w-44"
        />
      </Field>
    </div>
  );
}
