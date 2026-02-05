"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Loader2, FileText } from "lucide-react";

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

import { exportAnnotations } from "../services";

interface ExportModalProps {
  exportableCount: number;
  children?: ReactNode;
}

export function ExportModal({ exportableCount, children }: ExportModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportAnnotations(fileName || undefined);

      if (result.error) {
        toast.error(result.message || "Failed to export annotations");
        return;
      }

      toast.success(`Exported ${result.export.sentence_count} sentences!`);

      // Open download URL in new tab
      if (result.export.download_url) {
        window.open(result.export.download_url, "_blank");
      }

      setOpen(false);
      setFileName("");
      router.refresh();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button disabled={exportableCount === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export ({exportableCount})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Annotations
          </DialogTitle>
          <DialogDescription>
            Export all annotated sentences that haven&apos;t been exported yet.
            This will generate a CSV file and mark these sentences as exported.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Sentences to export:
              </span>
              <span className="text-lg font-semibold text-slate-900">
                {exportableCount}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileName">File Name (optional)</Label>
            <Input
              id="fileName"
              placeholder="annotations-export"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Leave empty for auto-generated timestamp name
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || exportableCount === 0}
          >
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
