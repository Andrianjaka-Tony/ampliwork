"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CircuitBoard, LogOut, Receipt, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLogout } from "@/lib/auth/auth.hooks";
import type { Session, Tab } from "@/lib/auth/auth.schema";
import { allowedTabs, TAB_LABELS, TAB_PATHS } from "@/lib/auth/auth.rbac";

const TAB_ICONS: Record<Tab, typeof Receipt> = {
  transactions: Receipt,
  stats: BarChart3,
  custom: Sparkles,
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppSidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const logout = useLogout();
  const tabs = allowedTabs(session);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <CircuitBoard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Circuit Labs</span>
                  <span className="truncate text-xs text-muted-foreground">Finance</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tabs.map((tab) => {
                const Icon = TAB_ICONS[tab];
                return (
                  <SidebarMenuItem key={tab}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(TAB_PATHS[tab])}
                      tooltip={TAB_LABELS[tab]}
                    >
                      <Link href={TAB_PATHS[tab]}>
                        <Icon className="size-4" />
                        <span>{TAB_LABELS[tab]}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{initials(session.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session.name}</span>
                <span className="truncate text-xs text-muted-foreground capitalize">
                  {session.role.replace("_", " ")}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout">
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
