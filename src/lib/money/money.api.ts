import { apiFetch } from "@/lib/api/api.client";

import { ratesFileSchema, type RatesFile } from "./money.schema";

export function getRates(signal?: AbortSignal): Promise<RatesFile> {
  return apiFetch("/api/rates", { schema: ratesFileSchema, signal });
}
