"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/molecules/file-dropzone";

// Example 1: Image Upload
export function ImageUploadExample() {
  const [image, setImage] = useState<File | null>(null);

  return (
    <FileDropzone
      file={image}
      onFileSelect={setImage}
      label="Upload Profile Picture"
      accept={{
        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      }}
      maxSize={2 * 1024 * 1024} // 2MB
      placeholder="Drop your profile picture here"
      helperText="PNG, JPG, GIF, WebP up to 2MB"
      successMessage="Profile picture selected!"
      onValidate={(file) => {
        if (file.type.startsWith("image/")) {
          return null; // Valid
        }
        return "Please upload an image file";
      }}
    />
  );
}

// Example 2: Document Upload
export function DocumentUploadExample() {
  const [document, setDocument] = useState<File | null>(null);

  return (
    <FileDropzone
      file={document}
      onFileSelect={setDocument}
      label="Upload Contract"
      accept={{
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      }}
      maxSize={50 * 1024 * 1024} // 50MB
      placeholder="Upload your contract document"
      helperText="PDF, DOC, DOCX up to 50MB"
      successMessage="Contract uploaded successfully!"
    />
  );
}

// Example 3: Data Import
export function DataImportExample() {
  const [dataFile, setDataFile] = useState<File | null>(null);

  return (
    <FileDropzone
      file={dataFile}
      onFileSelect={setDataFile}
      label="Import Data"
      accept={{
        "text/csv": [".csv"],
        "application/json": [".json"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      }}
      maxSize={100 * 1024 * 1024} // 100MB
      placeholder="Drop your data file here"
      helperText="CSV, JSON, XLS, XLSX up to 100MB"
      onValidate={(file) => {
        if (file.name.toLowerCase().includes("test")) {
          return "Test files are not allowed in production";
        }
        return null;
      }}
    />
  );
}

// Example 4: Multiple Files
export function MultipleFilesExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileDropzone
      file={files.length > 0 ? files[0] : null} // For demo, show first file
      onFileSelect={(file) => {
        if (file) {
          setFiles([...files, file]);
        } else {
          setFiles([]);
        }
      }}
      multiple={true}
      label="Upload Multiple Images"
      accept={{
        "image/*": [".png", ".jpg", ".jpeg"],
      }}
      placeholder="Drop multiple images here"
      helperText="PNG, JPG, JPEG files"
    />
  );
}

// Example 5: Minimal Usage
export function MinimalExample() {
  const [file, setFile] = useState<File | null>(null);

  return <FileDropzone file={file} onFileSelect={setFile} />;
}

// Example 6: Custom Styled
export function CustomStyledExample() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FileDropzone
      file={file}
      onFileSelect={setFile}
      label="Custom Styled Upload"
      className="border-2 border-purple-200 rounded-xl"
      dropzoneClassName="border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100"
      placeholder="Drop files with custom styling"
    />
  );
}

// Example 7: Disabled State
export function DisabledExample() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <FileDropzone
      file={file}
      onFileSelect={setFile}
      disabled={isUploading}
      label="Upload (Disabled Demo)"
      placeholder={isUploading ? "Uploading..." : "Currently disabled"}
    />
  );
}
