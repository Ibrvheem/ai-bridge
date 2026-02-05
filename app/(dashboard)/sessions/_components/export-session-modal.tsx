"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2, ExternalLink, CheckCircle2 } from "lucide-react";
import { exportSession } from "../services";
import { ExportResponse } from "../types";

interface ExportSessionModalProps {
  children: React.ReactNode;
  sessionId: string;
  sessionName: string;
  exportableCount: number;
}

export function ExportSessionModal({
  children,
  sessionId,
  sessionName,
  exportableCount,
}: ExportSessionModalProps) {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [exportResult, setExportResult] = useState<ExportResponse | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await exportSession(sessionId, {
        file_name: fileName || undefined,
      });

      if ("error" in response) {
        toast.error(response.error);
        return;
      }

      setExportResult(response);
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to export session");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (exportResult?.export.download_url) {
      window.open(exportResult.export.download_url, "_blank");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setExportResult(null);
    setFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Session</DialogTitle>
          <DialogDescription>
            Export your annotated sentences to share with the ML team.
          </DialogDescription>
        </DialogHeader>

        {!exportResult ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-slate-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {exportableCount} sentences ready for export
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Only new sentences (not previously exported) will be
                    included to avoid duplicates.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileName">Custom File Name (Optional)</Label>
              <Input
                id="fileName"
                placeholder={`${sessionName.toLowerCase().replace(/\s+/g, "-")}-export.csv`}
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Leave empty to use auto-generated name with timestamp
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Export Successful!
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {exportResult.export.sentence_count} sentences exported
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-900 mb-2">
                {exportResult.export.file_name}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleDownload}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CSV
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleDownload}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Browser
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-lg font-bold text-slate-900">
                  {exportResult.session.total_annotated}
                </p>
                <p className="text-xs text-slate-500">Total Annotated</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-lg font-bold text-green-600">
                  {exportResult.session.total_exported}
                </p>
                <p className="text-xs text-slate-500">Total Exported</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-lg font-bold text-amber-600">
                  {exportResult.session.remaining_to_export}
                </p>
                <p className="text-xs text-slate-500">Remaining</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!exportResult ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || exportableCount === 0}
              >
                {isExporting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Export {exportableCount} Sentences
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
