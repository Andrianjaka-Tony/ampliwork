import { z } from "zod";

import { publicUserSchema } from "@/lib/auth/auth.schema";
import { bankSchema } from "@/lib/banks/banks.schema";
import { currencySchema } from "@/lib/money/money.schema";

export const transactionTypeSchema = z.enum(["debit", "credit"]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const transactionAuthorizerSchema = publicUserSchema.pick({
  id: true,
  name: true,
  email: true,
  role: true,
  title: true,
  department: true,
});
export type TransactionAuthorizer = z.infer<typeof transactionAuthorizerSchema>;

export const transactionSchema = z.object({
  id: z.string(),
  date: z.iso.date(),
  description: z.string(),
  amount: z.number().nonnegative(),
  currency: currencySchema,
  type: transactionTypeSchema,
  category: z.string(),
  vendor: z.string(),
  bank: bankSchema,

  authorizedBy: transactionAuthorizerSchema.nullable(),

  source: z.unknown(),
});
export type Transaction = z.infer<typeof transactionSchema>;

export const transactionListSchema = z.array(transactionSchema);

export const transactionQuerySchema = z.object({
  bank: bankSchema.optional(),
  authorizedBy: z.string().min(1).optional(),
  type: transactionTypeSchema.optional(),
  // "amount" = minimum (README param); "maxAmount" = upper bound.
  amount: z.coerce.number().nonnegative().optional(),
  maxAmount: z.coerce.number().nonnegative().optional(),
  // When set, amounts are converted to this currency before the min/max compare.
  currency: currencySchema.optional(),
  fromDate: z.iso.date().optional(),
  // Sort by date; defaults to earliest-first (README).
  order: z.enum(["asc", "desc"]).optional(),
  // Pagination is opt-in: present `page` switches the response to a page envelope.
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(30).optional(),
});
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

export const transactionPageSchema = z.object({
  items: transactionListSchema,
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});
export type TransactionPage = z.infer<typeof transactionPageSchema>;
