import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FolderOpen,
  ChevronRight,
  CheckCircle2,
  Clock,
  Users,
  Shield,
  AlertTriangle,
  ThumbsDown,
} from "lucide-react";
import dayjs from "@/lib/dayjs";
import Link from "next/link";
import {
  getReviewSessions,
  getMyAssignments,
  getMyRejectedSentences,
} from "./services";
import {
  ReviewSession,
  ReviewAssignment,
} from "@/lib/types/data-collection.types";

export default async function ReviewsPage() {
  const [sessions, assignments, rejectedSentences] = await Promise.all([
    getReviewSessions(),
    getMyAssignments(),
    getMyRejectedSentences(),
  ]);
  const sessionList: ReviewSession[] = Array.isArray(sessions) ? sessions : [];
  const assignmentList: ReviewAssignment[] = Array.isArray(assignments)
    ? assignments
    : [];
  const rejectedList = Array.isArray(rejectedSentences)
    ? rejectedSentences
    : [];
  const rejectedCount = rejectedList.filter(
    (s: any) => s.qa_status === "rejected",
  ).length;
  const appealedCount = rejectedList.filter(
    (s: any) => s.qa_status === "disputed",
  ).length;
  const totalReReviewAcrossSessions = sessionList.reduce(
    (sum, s) => sum + (s.needs_re_review || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Reviews
          </h1>
          <p className="text-slate-600">
            Review annotated sentences for quality assurance
          </p>
        </div>
      </div>

      {/* Notification Banners */}
      {totalReReviewAcrossSessions > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              {totalReReviewAcrossSessions} sentence
              {totalReReviewAcrossSessions > 1 ? "s" : ""} need re-review
            </p>
            <p className="text-xs text-amber-600">
              Annotators have appealed or resubmitted sentences in your review
              sessions.
            </p>
          </div>
        </div>
      )}

      {rejectedCount > 0 && (
        <Link href="/reviews/appeals">
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 hover:bg-red-100 transition-colors cursor-pointer">
            <ThumbsDown className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {rejectedCount} sentence{rejectedCount > 1 ? "s" : ""} rejected
                {appealedCount > 0 && (
                  <span className="text-amber-700 ml-1">
                    ({appealedCount} appealed)
                  </span>
                )}
              </p>
              <p className="text-xs text-red-600">
                You have rejected sentences that need attention. Click to review
                and appeal.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-red-400" />
          </div>
        </Link>
      )}

      {/* Assigned Annotators */}
      {assignmentList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />
            Assigned Annotators
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {assignmentList.map((assignment) => {
              const annotator =
                typeof assignment.annotator_id === "object"
                  ? assignment.annotator_id
                  : null;
              const annotatorId = annotator
                ? annotator._id
                : (assignment.annotator_id as string);
              return (
                <Link
                  key={assignment._id}
                  href={`/reviews/annotator/${annotatorId}`}
                >
                  <Card className="border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {annotator?.email || annotatorId}
                          </p>
                          <p className="text-xs text-slate-500">
                            View sessions to review
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Active / Completed Review Sessions */}
      <div className="space-y-3">
        {sessionList.length === 0 ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900">
              My Review Sessions
            </h2>
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">
                  No review sessions yet
                </h3>
                <p className="text-sm text-slate-600 mt-1 text-center max-w-md">
                  {assignmentList.length > 0
                    ? "Select an annotator above to browse their sessions and start reviewing."
                    : "You don't have any review assignments yet. An admin will assign annotators to you."}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="grid gap-4">
            {sessionList.map((session) => (
              <ReviewSessionCard key={session._id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewSessionCard({ session }: { session: ReviewSession }) {
  const progress =
    session.total_sentences > 0
      ? Math.round((session.total_reviewed / session.total_sentences) * 100)
      : 0;

  return (
    <Link href={`/reviews/${session._id}`}>
      <Card className="border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-3 rounded-lg bg-slate-100">
                <FileText className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {session.name}
                  </h3>
                  {session.status === "completed" ? (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{session.total_sentences} sentences</span>
                  <span>•</span>
                  <span>{session.total_reviewed} reviewed</span>
                  <span>•</span>
                  <span>{progress}% complete</span>
                  <span>•</span>
                  <span>{dayjs(session.created_at).format("MMM D, YYYY")}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="text-green-600">
                    {session.total_accepted} accepted
                  </span>
                  <span className="text-red-600">
                    {session.total_rejected} rejected
                  </span>
                  {session.needs_re_review > 0 && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs px-1.5 py-0">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {session.needs_re_review} needs re-review
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
