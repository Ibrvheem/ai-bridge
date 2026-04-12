import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  FolderOpen,
  ChevronRight,
  CheckCircle2,
  Play,
} from "lucide-react";
import dayjs from "@/lib/dayjs";
import Link from "next/link";
import { getAnnotatorSessions } from "../../services";
import { AnnotatorSession } from "@/lib/types/data-collection.types";
import { StartReviewButton } from "./_components/start-review-button";

interface AnnotatorSessionsPageProps {
  params: Promise<{ annotatorId: string }>;
}

export default async function AnnotatorSessionsPage({
  params,
}: AnnotatorSessionsPageProps) {
  const { annotatorId } = await params;
  const sessions = await getAnnotatorSessions(annotatorId);
  const sessionList: AnnotatorSession[] = Array.isArray(sessions)
    ? sessions
    : [];

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
            Annotator Sessions
          </h1>
          <p className="text-slate-600">
            Select an annotation session to review
          </p>
        </div>
      </div>

      {/* Sessions */}
      {sessionList.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              No annotated sessions found
            </h3>
            <p className="text-sm text-slate-600 mt-1 text-center max-w-md">
              This annotator hasn&apos;t completed any annotations yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessionList.map((session) => (
            <AnnotatorSessionCard
              key={session._id}
              session={session}
              annotatorId={annotatorId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AnnotatorSessionCard({
  session,
  annotatorId,
}: {
  session: AnnotatorSession;
  annotatorId: string;
}) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="p-3 rounded-lg bg-slate-100">
              <FileText className="h-6 w-6 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {session.original_filename}
              </h3>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                <span>{session.annotated_count} annotated sentences</span>
                <span>•</span>
                <span>{formatFileSize(session.file_size)}</span>
                <span>•</span>
                <span>{dayjs(session.created_at).format("MMM D, YYYY")}</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            {session.has_active_review && session.active_review_id ? (
              <Link href={`/reviews/${session.active_review_id}`}>
                <Button variant="outline" size="sm">
                  {session.review_status === "completed" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      View Review
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-amber-500" />
                      Continue Review
                    </>
                  )}
                </Button>
              </Link>
            ) : (
              <StartReviewButton
                documentId={session.document_id}
                annotatorId={annotatorId}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
