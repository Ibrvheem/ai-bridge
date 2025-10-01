"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Settings, Users, CreditCard, Bell, Shield } from "lucide-react";
import Link from "next/link";

const settingsCards = [
  {
    title: "Languages",
    description: "Manage supported languages for annotation",
    icon: Languages,
    href: "/settings/languages",
    color: "text-blue-600"
  },
  {
    title: "General",
    description: "Application settings and preferences",
    icon: Settings,
    href: "/settings/general",
    color: "text-gray-600"
  },
  {
    title: "Team",
    description: "Manage team members and permissions",
    icon: Users,
    href: "/settings/team",
    color: "text-green-600"
  },
  {
    title: "Billing",
    description: "Subscription and payment settings",
    icon: CreditCard,
    href: "/settings/billing",
    color: "text-purple-600"
  },
  {
    title: "Notifications",
    description: "Configure email and push notifications",
    icon: Bell,
    href: "/settings/notifications",
    color: "text-yellow-600"
  },
  {
    title: "Security",
    description: "Password and security settings",
    icon: Shield,
    href: "/settings/security",
    color: "text-red-600"
  }
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsCards.map((setting) => {
          const IconComponent = setting.icon;
          return (
            <Card key={setting.href} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${setting.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{setting.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {setting.description}
                </CardDescription>
                <Link href={setting.href}>
                  <Button variant="outline" className="w-full">
                    Configure
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground">
          Powered by <span className="font-semibold">Study Labs</span>
        </p>
      </footer>
    </div>
  );
}