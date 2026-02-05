import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, CheckCircle2, Clock } from "lucide-react";
import dayjs from "@/lib/dayjs";
import {
  getUnannotatedSentences,
  getExportStats,
  getExportHistory,
} from "./services";
import { getLanguages } from "../settings/languages/service";
import { Annotator, ExportModal, UploadSentencesModal } from "./_components";
import { ExportRecord } from "./types";

export default async function AnnotationsPage() {
  const [sentences, exportStats, exportHistory, languages] = await Promise.all([
    getUnannotatedSentences(),
    getExportStats(),
    getExportHistory(),
    getLanguages(),
  ]);

  const unannotatedCount = Array.isArray(sentences) ? sentences.length : 0;
  const exportableCount = exportStats?.exportable_count || 0;
  const totalExported = exportStats?.total_exported || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Annotate Sentences
          </h1>
          <p className="text-slate-600">
            Annotate sentences for bias detection training data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <UploadSentencesModal languages={languages}>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
          </UploadSentencesModal>
          <ExportModal exportableCount={exportableCount}>
            <Button disabled={exportableCount === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export ({exportableCount})
            </Button>
          </ExportModal>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              To Annotate
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {unannotatedCount}
            </div>
            <p className="text-xs text-slate-500">
              Sentences awaiting annotation
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Ready to Export
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {exportableCount}
            </div>
            <p className="text-xs text-slate-500">
              Annotated, not yet exported
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Exported
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalExported}
            </div>
            <p className="text-xs text-slate-500">Sentences already exported</p>
          </CardContent>
        </Card>
      </div>

      {/* Annotator */}
      {unannotatedCount > 0 ? (
        <Annotator sentences={sentences} />
      ) : (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              All caught up!
            </h3>
            <p className="text-sm text-slate-600 mt-1 text-center max-w-md">
              No sentences waiting for annotation. Upload more sentences to
              continue.
            </p>
            <div className="flex gap-3 mt-4">
              <UploadSentencesModal languages={languages}>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Sentences
                </Button>
              </UploadSentencesModal>
              {exportableCount > 0 && (
                <ExportModal exportableCount={exportableCount}>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export ({exportableCount})
                  </Button>
                </ExportModal>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export History */}
      {Array.isArray(exportHistory) && exportHistory.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Export History</CardTitle>
            <CardDescription>
              Previously exported annotation files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(exportHistory as ExportRecord[]).slice(0, 5).map((exp) => (
                <div
                  key={exp._id}
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
    </div>
  );
}
