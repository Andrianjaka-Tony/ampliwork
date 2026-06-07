import type { Session, Tab } from "./auth.schema";

export const ALL_TABS: readonly Tab[] = ["transactions", "stats", "custom"] as const;

export const TAB_LABELS: Record<Tab, string> = {
  transactions: "Transactions",
  stats: "Stats",
  custom: "Custom",
};

export const TAB_PATHS: Record<Tab, string> = {
  transactions: "/dashboard/transactions",
  stats: "/dashboard/stats",
  custom: "/dashboard/custom",
};

export function canAccessTab(session: Session | null | undefined, tab: Tab): boolean {
  return Boolean(session?.allowedTabs.includes(tab));
}

export function allowedTabs(session: Session): Tab[] {
  return ALL_TABS.filter((tab) => session.allowedTabs.includes(tab));
}

export function firstAllowedTab(session: Session): Tab | null {
  return allowedTabs(session)[0] ?? null;
}

export function tabFromPathname(pathname: string): Tab | null {
  return ALL_TABS.find((tab) => pathname.startsWith(TAB_PATHS[tab])) ?? null;
}
