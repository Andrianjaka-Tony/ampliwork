import { z } from "zod";

import { currencySchema } from "@/lib/money/money.schema";

export const bankSchema = z.enum(["chase", "boa", "amex"]);
export type Bank = z.infer<typeof bankSchema>;

const authorizerRefSchema = z.looseObject({
  name: z.string(),
  department: z.string(),
});

export const chaseTransactionSchema = z.looseObject({
  transactionId: z.string(),
  transactionDate: z.iso.date(),
  description: z.string(),
  amount: z.number(),
  transactionType: z.enum(["DEBIT", "CREDIT"]),
  categoryName: z.string(),
  merchantName: z.string(),
  initiatedBy: authorizerRefSchema,
  currency: currencySchema,
});
export type ChaseTransaction = z.infer<typeof chaseTransactionSchema>;

export const chaseFileSchema = z.looseObject({
  transactions: z.array(chaseTransactionSchema),
});
export type ChaseFile = z.infer<typeof chaseFileSchema>;

export const boaTransactionSchema = z.looseObject({
  id: z.string(),
  transactionDate: z.iso.date(),
  description: z.string(),
  payee: z.string(),
  amount: z.number(),
  debitCreditMemo: z.enum(["DEBIT", "CREDIT"]),
  spendingCategory: z.string(),
  originator: authorizerRefSchema,
  currencyCode: currencySchema,
});
export type BoaTransaction = z.infer<typeof boaTransactionSchema>;

export const boaFileSchema = z.looseObject({
  transactionList: z.array(boaTransactionSchema),
});
export type BoaFile = z.infer<typeof boaFileSchema>;

const amexMerchantSchema = z.looseObject({
  name: z.string(),
  category: z.string(),
});

export const amexChargeSchema = z.looseObject({
  chargeId: z.string(),
  transactionDate: z.iso.date(),
  merchant: amexMerchantSchema,
  amountInCents: z.number(),
  type: z.enum(["charge", "payment"]),
  memo: z.string(),
  employee: authorizerRefSchema,
  billingCurrency: currencySchema,
});
export type AmexCharge = z.infer<typeof amexChargeSchema>;

export const amexFileSchema = z.looseObject({
  data: z.looseObject({
    charges: z.array(amexChargeSchema),
  }),
});
export type AmexFile = z.infer<typeof amexFileSchema>;
