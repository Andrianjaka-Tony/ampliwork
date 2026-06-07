import { z } from "zod";

import { currencySchema } from "@/lib/money/money.schema";
import {
  transactionAuthorizerSchema,
  transactionSchema,
} from "@/lib/transactions/transactions.schema";

export const outlierSchema = z.object({
  transaction: transactionSchema,
  usdAmount: z.number(),
  categoryMedian: z.number(),
  ratio: z.number(),
});
export type Outlier = z.infer<typeof outlierSchema>;

export const approverStatSchema = z.object({
  authorizer: transactionAuthorizerSchema,
  total: z.number(),
  count: z.number().int(),
  largest: z.number(),
  share: z.number(),
});
export type ApproverStat = z.infer<typeof approverStatSchema>;

export const auditSummarySchema = z.object({
  currency: currencySchema,
  totals: z.object({
    totalSpend: z.number(),
    flaggedCount: z.number().int(),
    flaggedAmount: z.number(),
  }),
  outliers: z.array(outlierSchema),
  approvers: z.array(approverStatSchema),
});
export type AuditSummary = z.infer<typeof auditSummarySchema>;
