"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth/auth.hooks";
import { TAB_PATHS, firstAllowedTab } from "@/lib/auth/auth.rbac";

export default function DashboardIndexPage() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;
    const tab = firstAllowedTab(session);
    router.replace(tab ? TAB_PATHS[tab] : "/login");
  }, [session, router]);

  return null;
}
