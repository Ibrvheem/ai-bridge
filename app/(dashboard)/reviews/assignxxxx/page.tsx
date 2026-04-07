import Link from "next/link";
import { Shield } from "lucide-react";
import { getUsers, getAllAssignments } from "./services";
import { AssignmentManager } from "./_components/assignment-manager";

export default async function AssignReviewersPage() {
  const [users, assignments] = await Promise.all([
    getUsers(),
    getAllAssignments(),
  ]);
  console.log(users);

  const userList = Array.isArray(users) ? users : [];
  const assignmentList = Array.isArray(assignments) ? assignments : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/reviews"
            className="text-muted-foreground hover:text-foreground"
          >
            Reviews
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Assign QA</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-50">
            <Shield className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              QA Assignments
            </h1>
            <p className="text-slate-600">
              Assign reviewers to annotators for quality assurance
            </p>
          </div>
        </div>
      </div>

      <AssignmentManager users={userList} assignments={assignmentList} />
    </div>
  );
}
