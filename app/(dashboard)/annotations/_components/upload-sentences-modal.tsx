"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ControlledSelect from "@/components/molecules/controlled-select";
import { FileDropzone } from "@/components/molecules/file-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { Languages } from "../../settings/languages/types";
import { useUploadSentences } from "../_hooks/use-upload-sentences";

interface UploadSentencesModalProps {
  children: React.ReactNode;
  languages: Languages;
}

export function UploadSentencesModal({
  children,
  languages,
}: UploadSentencesModalProps) {
  const { onSubmit, form, file, setFile, open, setOpen, isSubmitting } =
    useUploadSentences();

  const formattedLanguages = languages.map((lang) => ({
    name: lang.name,
    value: lang.code,
  }));

  const downloadSampleExcel = () => {
    // Create a sample CSV content
    const sampleData = [
      ["sentence", "original_content", "language"],
      ["This is a sample sentence.", "Original content here", "en"],
      ["Another example sentence.", "More original content", "en"],
      ["Third example.", "Original text", "en"],
    ];
    const csvContent = sampleData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_sentences.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Sample file downloaded successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Sentences</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file containing sentences to be annotated.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Download sample */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Need a template?</p>
                  <p className="text-sm text-muted-foreground">
                    Download a sample CSV
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={downloadSampleExcel}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            {/* Language selection */}
            <ControlledSelect
              name="language"
              label="Language"
              placeholder="Select a language"
              description="Leave empty to set during annotation"
              values={formattedLanguages}
              className="w-full"
            />

            {/* File upload with reusable FileDropzone */}
            <FileDropzone
              file={file}
              onFileSelect={setFile}
              label="Upload File"
              placeholder="Click to upload or drag and drop"
              helperText="CSV, XLS, XLSX up to 10MB"
              accept={{
                "text/csv": [".csv"],
                "application/vnd.ms-excel": [".xls"],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx"],
              }}
              maxSize={10 * 1024 * 1024}
              successMessage="File selected successfully!"
              multiple={false}
            />

            {/* Upload button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !file}
            >
              {isSubmitting ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Sentences
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
