import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  History,
  ExternalLink,
} from "lucide-react";
import {
  getSessionWithSentences,
  getSessionStats,
  getExportHistory,
  getUnannotatedSentences,
} from "../services";
import { SessionStatus, ExportRecord } from "../types";
import dayjs from "@/lib/dayjs";
import { ExportSessionModal, SessionAnnotator } from "../_components";
import { SessionActions } from "./session-actions";

interface SessionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusBadge(status: SessionStatus) {
  switch (status) {
    case SessionStatus.ACTIVE:
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 border">
          <PlayCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case SessionStatus.PAUSED:
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 border">
          <PauseCircle className="h-3 w-3 mr-1" />
          Paused
        </Badge>
      );
    case SessionStatus.COMPLETED:
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 border">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case SessionStatus.EXPORTED:
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200 border">
          <Download className="h-3 w-3 mr-1" />
          Exported
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { id } = await params;
  const [session, stats, exports, unannotatedSentences] = await Promise.all([
    getSessionWithSentences(id),
    getSessionStats(id),
    getExportHistory(id),
    getUnannotatedSentences(),
  ]);

  if (!session) {
    notFound();
  }

  const exportableCount = stats?.exportable_count ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/sessions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sessions
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {session.name}
            </h1>
            {getStatusBadge(session.status)}
          </div>
          {session.description && (
            <p className="text-slate-600 mt-1">{session.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Started {dayjs(session.started_at).fromNow()}
            </span>
            <span className="flex items-center gap-1">
              <History className="h-3.5 w-3.5" />
              Last activity {dayjs(session.last_activity_at).fromNow()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SessionActions sessionId={id} currentStatus={session.status} />
          <ExportSessionModal
            sessionId={id}
            sessionName={session.name}
            exportableCount={exportableCount}
          >
            <Button disabled={exportableCount === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export ({exportableCount})
            </Button>
          </ExportSessionModal>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Annotated
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {session.total_annotated}
            </div>
            <p className="text-xs text-slate-500">Sentences in this session</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Exported
            </CardTitle>
            <Download className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {session.total_exported}
            </div>
            <p className="text-xs text-slate-500">Already exported</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Ready to Export
            </CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {exportableCount}
            </div>
            <p className="text-xs text-slate-500">New sentences</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Exports
            </CardTitle>
            <Layers className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {session.exports?.length ?? 0}
            </div>
            <p className="text-xs text-slate-500">Export files generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      {exports && exports.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Export History</CardTitle>
            <CardDescription>
              Previously exported files from this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(exports as ExportRecord[]).map((exp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {exp.file_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {exp.sentence_count} sentences •{" "}
                        {dayjs(exp.exported_at).format("MMM D, YYYY h:mm A")}
                      </p>
                    </div>
                  </div>
                  {exp.download_url && (
                    <a
                      href={exp.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annotation Section */}
      {session.status === SessionStatus.ACTIVE && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Annotate Sentences
              </h2>
              <p className="text-sm text-slate-600">
                {unannotatedSentences.length} unannotated sentences available
              </p>
            </div>
          </div>

          {unannotatedSentences.length > 0 ? (
            <SessionAnnotator
              sessionId={id}
              sentences={unannotatedSentences}
              annotatedIds={session.annotated_sentence_ids}
            />
          ) : (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">
                  No more sentences to annotate
                </h3>
                <p className="text-sm text-slate-600 mt-1 text-center max-w-md">
                  All available sentences have been annotated. Upload more
                  sentences or export your current work.
                </p>
                <div className="flex gap-3 mt-4">
                  <Link href="/annotations/unannotated">
                    <Button variant="outline">Upload More Sentences</Button>
                  </Link>
                  <ExportSessionModal
                    sessionId={id}
                    sessionName={session.name}
                    exportableCount={exportableCount}
                  >
                    <Button disabled={exportableCount === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Session
                    </Button>
                  </ExportSessionModal>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Session Sentences (for completed/paused sessions) */}
      {session.status !== SessionStatus.ACTIVE &&
        session.sentences &&
        session.sentences.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">
                Annotated Sentences ({session.sentences.length})
              </CardTitle>
              <CardDescription>
                Sentences annotated in this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {session.sentences.map((sentence) => (
                  <div
                    key={sentence._id}
                    className="p-3 rounded-lg border border-slate-200"
                  >
                    <p className="text-sm text-slate-900">{sentence.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {sentence.language}
                      </Badge>
                      {sentence.bias_label && (
                        <Badge variant="secondary" className="text-xs">
                          {sentence.bias_label}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
