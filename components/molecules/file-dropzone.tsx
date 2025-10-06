"use client";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface FileDropzoneProps {
  /** Current selected file */
  file: File | null;
  /** Callback when file is selected */
  onFileSelect: (file: File | null) => void;
  /** Optional label for the dropzone */
  label?: string;
  /** Placeholder text when no file is selected */
  placeholder?: string;
  /** Helper text shown below the dropzone */
  helperText?: string;
  /** Accepted file types */
  accept?: DropzoneOptions["accept"];
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Allow multiple files */
  multiple?: boolean;
  /** Disable the dropzone */
  disabled?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Custom className for the dropzone area */
  dropzoneClassName?: string;
  /** Show file preview */
  showPreview?: boolean;
  /** Custom success message on file select */
  successMessage?: string;
  /** Custom error message */
  errorMessage?: string;
  /** Custom validation function */
  onValidate?: (file: File) => string | null;
}

export function FileDropzone({
  file,
  onFileSelect,
  label,
  placeholder = "Click to upload or drag and drop",
  helperText,
  accept = {
    "text/csv": [".csv"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  disabled = false,
  className,
  dropzoneClassName,
  showPreview = true,
  successMessage,
  errorMessage,
  onValidate,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles: File[], rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          const rejection = rejectedFiles[0];
          const errorMsg =
            rejection.errors[0]?.message ||
            errorMessage ||
            "File upload failed";
          toast.error(errorMsg);
          return;
        }

        if (acceptedFiles.length > 0) {
          const selectedFile = acceptedFiles[0];

          // Custom validation
          if (onValidate) {
            const validationError = onValidate(selectedFile);
            if (validationError) {
              toast.error(validationError);
              return;
            }
          }

          onFileSelect(selectedFile);
          if (successMessage) {
            toast.success(successMessage);
          }
        }
      },
      accept,
      maxSize,
      multiple,
      disabled,
    });

  const removeFile = () => {
    onFileSelect(null);
    toast.info("File removed");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getAcceptedExtensions = () => {
    if (!accept) return "";
    return Object.values(accept).flat().join(", ").toUpperCase();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            {
              "border-blue-500 bg-blue-50": isDragActive,
              "border-gray-300 hover:border-gray-400":
                !isDragActive && !disabled,
              "border-gray-200 bg-gray-50 cursor-not-allowed": disabled,
            },
            dropzoneClassName
          )}
        >
          <input {...getInputProps()} style={{ display: "none" }} />
          <Upload
            className={cn(
              "h-8 w-8 mx-auto mb-2",
              disabled ? "text-gray-300" : "text-gray-400"
            )}
          />
          <p
            className={cn(
              "text-sm mb-1",
              disabled ? "text-gray-400" : "text-gray-600"
            )}
          >
            {isDragActive ? "Drop the file here..." : placeholder}
          </p>
          {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
          {!helperText && (
            <p className="text-xs text-gray-400">
              {getAcceptedExtensions()} up to {formatFileSize(maxSize)}
            </p>
          )}
        </div>
      ) : (
        showPreview && (
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-green-700">{file.name}</p>
                  <p className="text-sm text-green-600">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )
      )}

      {fileRejections.length > 0 && (
        <div className="text-sm text-red-600">
          {fileRejections[0].errors[0]?.message}
        </div>
      )}
    </div>
  );
}
