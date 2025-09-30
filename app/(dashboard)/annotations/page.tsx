"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockSentences = [
  {
    id: 1,
    text: "The quick brown fox jumps over the lazy dog.",
    language: "English",
    uploadDate: "2023-09-15",
    status: "pending",
  },
  {
    id: 2,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    language: "Latin",
    uploadDate: "2023-09-14",
    status: "pending",
  },
  {
    id: 3,
    text: "Hello world, this is a sample sentence for annotation.",
    language: "English",
    uploadDate: "2023-09-13",
    status: "pending",
  },
  {
    id: 4,
    text: "Machine learning is transforming the way we process data.",
    language: "English",
    uploadDate: "2023-09-12",
    status: "pending",
  },
  {
    id: 5,
    text: "Natural language processing enables computers to understand human language.",
    language: "English",
    uploadDate: "2023-09-11",
    status: "pending",
  },
];

export default function AnnotationsPage() {
  const [sentences] = useState(mockSentences);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "arabic", label: "Arabic" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // File type validation
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const allowedExtensions = [".csv", ".xls", ".xlsx"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      toast.error("Invalid file type. Please upload a CSV or Excel file.");
      return;
    }

    // File size validation (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        "File size too large. Please upload a file smaller than 10MB."
      );
      return;
    }

    setUploadFile(file);
  };

  const downloadSampleExcel = () => {
    // Create a sample CSV content
    const sampleData = [
      ["sentence", "language"],
      ["The quick brown fox jumps over the lazy dog", "English"],
      ["Lorem ipsum dolor sit amet", "Latin"],
      ["Bonjour le monde", "French"],
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

  const handleUpload = async () => {
    if (!uploadFile || !selectedLanguage) {
      toast.error("Please select a language and upload a file.");
      return;
    }

    setIsUploading(true);

    // Simulate upload process
    try {
      // Here you would typically send the file to your backend
      // const formData = new FormData();
      // formData.append('file', uploadFile);
      // formData.append('language', selectedLanguage);
      // await uploadSentences(formData);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Upload completed successfully! Check back later to see the processed sentences."
      );

      // Reset form
      setUploadFile(null);
      setSelectedLanguage("");
      setIsUploadModalOpen(false);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      completed: "default",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Un-annotated Sentences
          </h1>
          <p className="text-muted-foreground">
            Manage and upload sentences for annotation
          </p>
        </div>

        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Sentences</DialogTitle>
              <DialogDescription>
                Upload a CSV or Excel file containing sentences to be annotated.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Download sample */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">Need a template?</p>
                    <p className="text-sm text-muted-foreground">
                      Download a sample
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadSampleExcel}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              {/* Language selection */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    id="file"
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="file"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploadFile
                        ? uploadFile.name
                        : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-gray-400">
                      CSV, XLS, XLSX up to 10MB
                    </span>
                  </Label>
                </div>
                {uploadFile && (
                  <p className="text-sm text-green-600">
                    ✓ File selected: {uploadFile.name}
                  </p>
                )}
              </div>

              {/* Upload button */}
              <Button
                onClick={handleUpload}
                className="w-full"
                disabled={!uploadFile || !selectedLanguage || isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Sentences
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sentences
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentences.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting annotation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Badge variant="secondary">
              {new Set(sentences.map((s) => s.language)).size}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(sentences.map((s) => s.language)).size}
            </div>
            <p className="text-xs text-muted-foreground">Different languages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sentences.filter((s) => s.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for annotation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sentences Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sentences List</CardTitle>
          <CardDescription>
            All sentences waiting for annotation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Sentence</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sentences.map((sentence) => (
                <TableRow key={sentence.id}>
                  <TableCell className="font-medium">#{sentence.id}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {sentence.text}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sentence.language}</Badge>
                  </TableCell>
                  <TableCell>{sentence.uploadDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(sentence.status)}
                      {getStatusBadge(sentence.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground">
          Powered by <span className="font-semibold">Study Labs</span>
        </p>
      </footer>
    </div>
  );
}
