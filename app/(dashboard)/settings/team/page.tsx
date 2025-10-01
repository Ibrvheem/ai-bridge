import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";

export default function TeamSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/settings" className="text-muted-foreground hover:text-foreground">
            Settings
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Team</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">
          Manage team members and permissions
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="text-center py-12">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Users className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Team management features will be available in a future update.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Footer */}
      <footer className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground">
          Powered by <span className="font-semibold">Study Labs</span>
        </p>
      </footer>
    </div>
  );
}