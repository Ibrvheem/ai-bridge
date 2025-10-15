import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserSchema } from "../(auth)/login/types";
import { decodeToken } from "@/lib/auth";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await decodeToken()) as UserSchema | null;

  return (
    <SidebarProvider>
      <AppSidebar user={user || { id: "", email: "guest@example.com" }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
