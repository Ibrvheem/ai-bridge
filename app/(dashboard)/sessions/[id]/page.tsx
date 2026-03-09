import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import {
  getSessionStats,
  getSessionUnannotated,
  getSessions,
} from "../services";
import { Annotator } from "../_components";
import { SessionStats, DataCollection } from "../types";
import { ExportSessionButton } from "./_components/export-session-button";

interface SessionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { id: documentId } = await params;

  const [stats, sentences, sessions] = await Promise.all([
    getSessionStats(documentId),
    getSessionUnannotated(documentId),
    getSessions(),
  ]);

  const sessionStats: SessionStats = stats || {
    total: 0,
    annotated: 0,
    unannotated: 0,
    exported: 0,
    exportable: 0,
    progress: 0,
  };

  const unannotatedSentences: DataCollection[] = Array.isArray(sentences)
    ? sentences
    : [];

  // Find session info
  const session = Array.isArray(sessions)
    ? sessions.find((s: any) => s.document_id === documentId)
    : null;

  const sessionName =
    session?.original_filename || `Session ${documentId.slice(0, 8)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/sessions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {sessionName}
            </h1>
            <p className="text-slate-600">Annotate sentences in this session</p>
          </div>
        </div>
        <ExportSessionButton
          documentId={documentId}
          exportableCount={sessionStats.exportable}
          annotatedCount={sessionStats.annotated}
        />
      </div>

      {/* Progress Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {sessionStats.total}
            </div>
            <p className="text-xs text-slate-500">Total sentences</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Annotated
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sessionStats.annotated}
            </div>
            <Progress value={sessionStats.progress} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Remaining
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {sessionStats.unannotated}
            </div>
            <p className="text-xs text-slate-500">To annotate</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Ready to Export
            </CardTitle>
            <Download className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sessionStats.exportable}
            </div>
            <p className="text-xs text-slate-500">Unexported annotations</p>
          </CardContent>
        </Card>
      </div>

      {/* Annotator or Completion Message */}
      {unannotatedSentences.length > 0 ? (
        <Annotator sentences={unannotatedSentences} />
      ) : (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              Session Complete!
            </h3>
            <p className="text-sm text-slate-600 mt-1 text-center max-w-md">
              All {sessionStats.total} sentences in this session have been
              annotated.
              {sessionStats.exportable > 0 && (
                <>
                  {" "}
                  You have {sessionStats.exportable} annotations ready to
                  export.
                </>
              )}
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="/sessions">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sessions
                </Button>
              </Link>
              {sessionStats.annotated > 0 && (
                <ExportSessionButton
                  documentId={documentId}
                  exportableCount={sessionStats.exportable}
                  annotatedCount={sessionStats.annotated}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
