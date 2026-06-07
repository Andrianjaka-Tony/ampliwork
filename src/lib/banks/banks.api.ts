import { apiFetch } from "@/lib/api/api.client";

import {
  amexFileSchema,
  boaFileSchema,
  chaseFileSchema,
  type AmexFile,
  type BoaFile,
  type ChaseFile,
} from "./banks.schema";

export function getRawChase(signal?: AbortSignal): Promise<ChaseFile> {
  return apiFetch("/api/banks/chase/transactions", { schema: chaseFileSchema, enveloped: false, signal });
}

export function getRawBoa(signal?: AbortSignal): Promise<BoaFile> {
  return apiFetch("/api/banks/boa/transactions", { schema: boaFileSchema, enveloped: false, signal });
}

export function getRawAmex(signal?: AbortSignal): Promise<AmexFile> {
  return apiFetch("/api/banks/amex/transactions", { schema: amexFileSchema, enveloped: false, signal });
}
