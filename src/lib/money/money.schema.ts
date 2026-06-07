import { z } from "zod";

export const currencySchema = z.enum(["USD", "EUR", "GBP", "CAD"]);
export type Currency = z.infer<typeof currencySchema>;

export const ratesSchema = z.record(currencySchema, z.number().positive());
export type Rates = z.infer<typeof ratesSchema>;

export const ratesFileSchema = z.object({
  note: z.string().optional(),
  base: currencySchema,
  asOf: z.iso.date(),
  rates: ratesSchema,
});
export type RatesFile = z.infer<typeof ratesFileSchema>;
