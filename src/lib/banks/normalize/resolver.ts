import type { TransactionAuthorizer } from "@/lib/transactions/transactions.schema";

export type AuthorizerResolver = (name: string | null | undefined) => TransactionAuthorizer | null;
