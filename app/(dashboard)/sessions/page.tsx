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
  Upload,
  FileText,
  FolderOpen,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import dayjs from "@/lib/dayjs";
import Link from "next/link";
import { getSessions } from "./services";
import { getLanguages } from "../settings/languages/service";
import { UploadSentencesModal } from "./_components";
import { Session } from "./types";

export default async function SessionsPage() {
  const [sessions, languages] = await Promise.all([
    getSessions(),
    getLanguages(),
  ]);

  const sessionList: Session[] = Array.isArray(sessions) ? sessions : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Annotation Sessions
          </h1>
          <p className="text-slate-600">
            Upload files and annotate sentences by session
          </p>
        </div>
        <UploadSentencesModal languages={languages}>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </UploadSentencesModal>
      </div>

      {/* Sessions List */}
      {sessionList.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              No sessions yet
            </h3>
            <p className="text-sm text-slate-600 mt-1 text-center max-w-md">
              Upload a CSV file to create your first annotation session. Each
              upload becomes a session you can annotate and export.
            </p>
            <UploadSentencesModal languages={languages}>
              <Button className="mt-6">
                <Upload className="h-4 w-4 mr-2" />
                Create First Session
              </Button>
            </UploadSentencesModal>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessionList.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const getStatusBadge = () => {
    switch (session.status) {
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Link href={`/sessions/${session.document_id}`}>
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
                    {session.original_filename}
                  </h3>
                  {getStatusBadge()}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{session.successful_inserts} sentences</span>
                  <span>•</span>
                  <span>{formatFileSize(session.file_size)}</span>
                  <span>•</span>
                  <span>{dayjs(session.created_at).format("MMM D, YYYY")}</span>
                </div>
                {session.duplicate_count > 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    {session.duplicate_count} duplicates skipped
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
