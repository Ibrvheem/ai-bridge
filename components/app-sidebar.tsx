"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  LifeBuoy,
  Send,
  Settings2,
  SquareTerminal,
  WholeWord,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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
      title: "Annotations",
      url: "/annotations",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Unannotated Sentences",
          url: "/annotations/unannotated",
        },
        {
          title: "Annotated Sentences",
          url: "/annotations/annotated",
        },
      ],
    },
    {
      title: "Sentences",
      url: "/sentences",
      icon: WholeWord,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Languages",
          url: "/settings/languages",
        },
        // {
        //   title: "General",
        //   url: "/settings/general",
        // },
        // {
        //   title: "Team",
        //   url: "/settings/team",
        // },
        // {
        //   title: "Billing",
        //   url: "/settings/billing",
        // },
      ],
    },
  ],
  wip: [
    {
      title: "Models - WIP",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation - WIP",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
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
        <NavSecondary
          items={data.wip}
          className="mt-auto"
          groupLabel="Nice to Have"
        />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
          groupLabel="Nice to Have"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
