import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import {
  getReviewSession,
  getReviewSessionStats,
  getReviewSentences,
} from "../services";
import { ReviewSessionStats } from "@/lib/types/data-collection.types";
import { Reviewer } from "./_components/reviewer";

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewDetailPage({
  params,
}: ReviewDetailPageProps) {
  const { id } = await params;

  const [session, stats, pendingSentences] = await Promise.all([
    getReviewSession(id),
    getReviewSessionStats(id),
    getReviewSentences(id, "pending"),
  ]);

  const sessionStats: ReviewSessionStats = stats || {
    total_sentences: 0,
    total_reviewed: 0,
    total_accepted: 0,
    total_rejected: 0,
    remaining: 0,
    status: "active",
  };

  const sentences = Array.isArray(pendingSentences) ? pendingSentences : [];
  const sessionName = session?.name || "Review Session";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reviews">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {sessionName}
              </h1>
              {sessionStats.status === "completed" ? (
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
            <p className="text-slate-600">
              Review annotated sentences for quality
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {sessionStats.total_sentences}
            </div>
            <p className="text-xs text-slate-500">Sentences to review</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Reviewed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sessionStats.total_reviewed}
            </div>
            <p className="text-xs text-slate-500">
              {sessionStats.remaining} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Accepted
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sessionStats.total_accepted}
            </div>
            <p className="text-xs text-slate-500">Approved</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Rejected
            </CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {sessionStats.total_rejected}
            </div>
            <p className="text-xs text-slate-500">Needs re-annotation</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviewer or Completion */}
      {sentences.length > 0 ? (
        <Reviewer sentences={sentences} sessionId={id} />
      ) : (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              {sessionStats.status === "completed"
                ? "Review Complete!"
                : "No pending sentences"}
            </h3>
            <p className="text-sm text-slate-600 mt-1 text-center max-w-md">
              {sessionStats.status === "completed"
                ? `All ${sessionStats.total_sentences} sentences have been reviewed. ${sessionStats.total_accepted} accepted, ${sessionStats.total_rejected} rejected.`
                : "All sentences in this session have been reviewed."}
            </p>
            <Link href="/reviews" className="mt-4">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reviews
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
