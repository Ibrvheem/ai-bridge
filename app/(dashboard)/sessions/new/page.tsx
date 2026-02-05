import { redirect } from "next/navigation";

// This page redirects to the sessions page - the "New Session" functionality
// is handled via the CreateSessionModal on the sessions page
export default function NewSessionPage() {
  redirect("/sessions");
}
