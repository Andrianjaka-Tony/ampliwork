import type { Transaction } from "@/lib/transactions/transactions.schema";

import type { AmexFile, BoaFile, ChaseFile } from "../banks.schema";
import { normalizeAmex } from "./amex";
import { normalizeBoa } from "./boa";
import { normalizeChase } from "./chase";
import type { AuthorizerResolver } from "./resolver";

export type { AuthorizerResolver } from "./resolver";

type BankFiles = {
  chase: ChaseFile;
  boa: BoaFile;
  amex: AmexFile;
};

export function normalizeBanks(files: BankFiles, resolve: AuthorizerResolver): Transaction[] {
  return [
    ...normalizeChase(files.chase, resolve),
    ...normalizeBoa(files.boa, resolve),
    ...normalizeAmex(files.amex, resolve),
  ];
}
