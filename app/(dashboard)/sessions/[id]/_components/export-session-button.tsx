"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportSession } from "../../services";

interface ExportSessionButtonProps {
  documentId: string;
  exportableCount: number;
  annotatedCount: number;
}

export function ExportSessionButton({
  documentId,
  exportableCount,
  annotatedCount,
}: ExportSessionButtonProps) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (exportAll: boolean) => {
    const count = exportAll ? annotatedCount : exportableCount;
    if (count === 0) return;

    setIsExporting(true);
    try {
      const result = await exportSession(documentId, exportAll);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success && result.export?.download_url) {
        toast.success(
          `Exported ${result.export.sentence_count} sentences successfully!`,
        );
        // Auto-download
        window.open(result.export.download_url, "_blank");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to export annotations");
    } finally {
      setIsExporting(false);
    }
  };

  const hasExportable = exportableCount > 0 || annotatedCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={!hasExportable || isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport(false)}
          disabled={exportableCount === 0}
        >
          Export New Only ({exportableCount})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport(true)}
          disabled={annotatedCount === 0}
        >
          Export All Annotated ({annotatedCount})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
