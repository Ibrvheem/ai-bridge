import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ThumbsDown, AlertTriangle, FolderOpen } from "lucide-react";
import Link from "next/link";
import { getMyRejectedSentences } from "../services";
import { AnnotatedData, QAStatus } from "@/lib/types/data-collection.types";
import { RejectedSentenceItem } from "./_components/rejected-sentence-item";

export default async function AppealsPage() {
  const data = await getMyRejectedSentences();
  const sentences: AnnotatedData[] = Array.isArray(data) ? data : [];

  const rejectedCount = sentences.filter(
    (s) => s.qa_status === QAStatus.REJECTED,
  ).length;
  const appealedCount = sentences.filter(
    (s) => s.qa_status === QAStatus.DISPUTED,
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/reviews">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Appeals
          </h1>
          <p className="text-slate-600">
            Review rejected sentences and submit appeals
          </p>
        </div>
      </div>

      {/* Stats */}
      {sentences.length > 0 && (
        <div className="flex items-center gap-4">
          <Badge variant="destructive" className="text-sm px-3 py-1">
            <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
            {rejectedCount} Rejected
          </Badge>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-sm px-3 py-1">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            {appealedCount} Appealed
          </Badge>
        </div>
      )}

      {/* Sentences */}
      {sentences.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              No rejected sentences
            </h3>
            <p className="text-sm text-slate-600 mt-1 text-center max-w-md">
              You don&apos;t have any rejected sentences to review. Keep up the
              good work!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sentences.map((sentence) => (
            <RejectedSentenceItem key={sentence._id} sentence={sentence} />
          ))}
        </div>
      )}
    </div>
  );
}
