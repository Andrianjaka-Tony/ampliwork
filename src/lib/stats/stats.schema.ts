import { z } from "zod";

import { currencySchema } from "@/lib/money/money.schema";

export const vendorTotalSchema = z.object({
  vendor: z.string(),
  total: z.number(),
});
export type VendorTotal = z.infer<typeof vendorTotalSchema>;

export const categoryTotalSchema = z.object({
  category: z.string(),
  total: z.number(),
});
export type CategoryTotal = z.infer<typeof categoryTotalSchema>;

export const monthlyFlowSchema = z.object({
  month: z.string(),
  cashIn: z.number(),
  cashOut: z.number(),
});
export type MonthlyFlow = z.infer<typeof monthlyFlowSchema>;

export const statsKpisSchema = z.object({
  cashIn: z.number(),
  cashOut: z.number(),
  netCashFlow: z.number(),
  vendorCount: z.number().int(),
  topVendor: vendorTotalSchema.nullable(),
  topCategory: categoryTotalSchema.nullable(),
});
export type StatsKpis = z.infer<typeof statsKpisSchema>;

export const statsSummarySchema = z.object({
  currency: currencySchema,
  kpis: statsKpisSchema,
  topVendors: z.array(vendorTotalSchema),
  spendByCategory: z.array(categoryTotalSchema),
  byMonth: z.array(monthlyFlowSchema),
});
export type StatsSummary = z.infer<typeof statsSummarySchema>;
