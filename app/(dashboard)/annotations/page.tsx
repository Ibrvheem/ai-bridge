import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  FileText,
  Target,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Download,
  Clock,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { getUploadHistory, uploadStats } from "./services";
import dayjs from "@/lib/dayjs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { UploadHistorySchema } from "./types";

export default async function AnnotationsPage() {
  const upload_stats = await uploadStats();
  const upload_history: UploadHistorySchema[] = await getUploadHistory();

  // Extract stats from the first item (aggregated stats)
  const stats = upload_stats[0] || {
    total_documents: 0,
    total_sentences_processed: 0,
    total_successful_inserts: 0,
    total_duplicates: 0,
    total_errors: 0,
    completed_uploads: 0,
    failed_uploads: 0,
    processing_uploads: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Annotations Dashboard
          </h1>
          <p className="text-slate-600">
            Manage and track sentence annotation progress
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Sentences
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.total_sentences_processed}
            </div>
            <p className="text-xs text-slate-500">Processed sentences</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Successful
            </CardTitle>
            <Target className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.total_successful_inserts}
            </div>
            <p className="text-xs text-slate-500">
              {stats.total_sentences_processed > 0
                ? Math.round(
                    (stats.total_successful_inserts /
                      stats.total_sentences_processed) *
                      100
                  )
                : 0}
              % success rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Duplicates
            </CardTitle>
            <BookOpen className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.total_duplicates}
            </div>
            <p className="text-xs text-slate-500">Duplicate entries found</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Documents
            </CardTitle>
            <Upload className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.total_documents}
            </div>
            <p className="text-xs text-slate-500">
              {stats.completed_uploads} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-slate-200 bg-white">
          <Link href="/annotations/unannotated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-900">
                  Un-annotated Sentences
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700"
                >
                  {stats.total_successful_inserts} available
                </Badge>
              </div>
              <CardDescription className="text-slate-600">
                View and manage sentences that are waiting for annotation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Upload new sentences, view pending items, and start the
                annotation process.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-slate-200 bg-white">
          <Link href="/annotations/annotated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-900">
                  Annotated Sentences
                </CardTitle>
                <Badge
                  variant="outline"
                  className="border-slate-300 text-slate-700"
                >
                  Coming soon
                </Badge>
              </div>
              <CardDescription className="text-slate-600">
                Review and manage sentences that have been annotated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                View completed annotations, edit existing labels, and export
                annotated data.
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Upload History */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Upload History</CardTitle>
          <CardDescription className="text-slate-600">
            Recent file uploads and processing results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upload_history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700">File</TableHead>
                  <TableHead className="text-slate-700">Status</TableHead>
                  <TableHead className="text-slate-700">Processed</TableHead>
                  <TableHead className="text-slate-700">Success</TableHead>
                  <TableHead className="text-slate-700">Duplicates</TableHead>
                  <TableHead className="text-slate-700">Upload Date</TableHead>
                  <TableHead className="text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upload_history.map((upload) => (
                  <TableRow key={upload._id} className="border-slate-200">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {upload.original_filename}
                          </p>
                          <p className="text-xs text-slate-500">
                            {upload.file_size < 1024 * 1024
                              ? `${(upload.file_size / 1024).toFixed(1)} KB`
                              : upload.file_size < 1024 * 1024 * 1024
                              ? `${(upload.file_size / (1024 * 1024)).toFixed(
                                  1
                                )} MB`
                              : `${(
                                  upload.file_size /
                                  (1024 * 1024 * 1024)
                                ).toFixed(1)} GB`}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {upload.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : upload.status === "failed" ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-600" />
                        )}
                        <Badge
                          variant={
                            upload.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            upload.status === "completed"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                              : upload.status === "failed"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {upload.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-900 font-medium">
                        {upload.total_rows}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-700 font-medium">
                          {upload.successful_inserts}
                        </span>
                        {upload.total_rows > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-emerald-200 text-emerald-700"
                          >
                            {Math.round(
                              (upload.successful_inserts / upload.total_rows) *
                                100
                            )}
                            %
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-amber-700 font-medium">
                        {upload.duplicate_count}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-slate-900">
                          {dayjs(upload.created_at).format("MMM D, YYYY")}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {dayjs(upload.created_at).fromNow()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={upload.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          <Download className="h-3 w-3 " />
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8">
              <EmptyState
                icon={FolderOpen}
                title="No uploads yet"
                description="Upload your first CSV file to see upload history and processing results here."
                action={{
                  label: "Upload Sentences",
                  href: "/annotations/unannotated",
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Powered by{" "}
          <span className="font-semibold text-slate-700">Study Labs</span>
        </p>
      </footer>
    </div>
  );
}
