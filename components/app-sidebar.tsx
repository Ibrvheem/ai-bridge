"use client";

import * as React from "react";
import { GalleryVerticalEnd, FolderOpen, ClipboardCheck } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserSchema } from "@/app/(auth)/login/types";

const data = {
  user: {
    name: "Admin Account",

    avatar: "",
  },
  navMain: [
    {
      title: "Sessions",
      url: "/sessions",
      icon: FolderOpen,
      isActive: true,
      items: [],
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: ClipboardCheck,
      isActive: false,
      items: [
        { title: "My Reviews", url: "/reviews" },
        { title: "My Appeals", url: "/reviews/appeals" },
        // { title: "Assign QA", url: "/reviews/assign" },
      ],
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: UserSchema;
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">AI BRIDGE</span>
                  <span className="truncate text-xs">StudyLabs</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
