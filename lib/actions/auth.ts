"use server";

import { clearAuthTokens } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
    await clearAuthTokens();
    redirect("/login");
}