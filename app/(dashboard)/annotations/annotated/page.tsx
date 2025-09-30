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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText, CheckCircle2, Download, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for annotated sentences
const mockAnnotatedSentences = [
  {
    id: 1,
    text: "The quick brown fox jumps over the lazy dog.",
    language: "English",
    annotation:
      "This is a pangram sentence containing all letters of the alphabet.",
    annotator: "John Doe",
    annotationDate: "2023-09-20",
    confidence: 0.95,
  },
  {
    id: 2,
    text: "Machine learning is transforming the way we process data.",
    language: "English",
    annotation:
      "Technical sentence about artificial intelligence and data processing.",
    annotator: "Jane Smith",
    annotationDate: "2023-09-19",
    confidence: 0.88,
  },
  {
    id: 3,
    text: "Natural language processing enables computers to understand human language.",
    language: "English",
    annotation: "Definition sentence explaining NLP technology capabilities.",
    annotator: "Bob Wilson",
    annotationDate: "2023-09-18",
    confidence: 0.92,
  },
];

export default function AnnotatedSentencesPage() {
  const [annotatedSentences] = useState(mockAnnotatedSentences);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSentence, setSelectedSentence] = useState<
    (typeof mockAnnotatedSentences)[0] | null
  >(null);

  const filteredSentences = annotatedSentences.filter(
    (sentence) =>
      sentence.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sentence.annotation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sentence.annotator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const csvContent = [
      [
        "ID",
        "Sentence",
        "Language",
        "Annotation",
        "Annotator",
        "Date",
        "Confidence",
      ],
      ...annotatedSentences.map((sentence) => [
        sentence.id,
        sentence.text,
        sentence.language,
        sentence.annotation,
        sentence.annotator,
        sentence.annotationDate,
        sentence.confidence,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "annotated_sentences.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Annotated Sentences
          </h1>
          <p className="text-muted-foreground">
            View and manage completed annotations
          </p>
        </div>

        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Annotated
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {annotatedSentences.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed annotations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Confidence
            </CardTitle>
            <Badge variant="secondary">Score</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                (annotatedSentences.reduce((sum, s) => sum + s.confidence, 0) /
                  annotatedSentences.length) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Average annotation confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(annotatedSentences.map((s) => s.language)).size}
            </div>
            <p className="text-xs text-muted-foreground">Different languages</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Annotations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sentences, annotations, or annotators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Annotated Sentences Table */}
      <Card>
        <CardHeader>
          <CardTitle>Annotations List</CardTitle>
          <CardDescription>
            All completed sentence annotations ({filteredSentences.length}{" "}
            results)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Sentence</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Annotator</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSentences.map((sentence) => (
                <TableRow key={sentence.id}>
                  <TableCell className="font-medium">#{sentence.id}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {sentence.text}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sentence.language}</Badge>
                  </TableCell>
                  <TableCell>{sentence.annotator}</TableCell>
                  <TableCell>{sentence.annotationDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sentence.confidence >= 0.9
                          ? "default"
                          : sentence.confidence >= 0.7
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {(sentence.confidence * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSentence(sentence)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Annotation Details</DialogTitle>
                          <DialogDescription>
                            View complete annotation information
                          </DialogDescription>
                        </DialogHeader>
                        {selectedSentence && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">
                                Original Sentence
                              </h4>
                              <p className="p-3 bg-muted rounded-lg">
                                {selectedSentence.text}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Annotation</h4>
                              <p className="p-3 bg-muted rounded-lg">
                                {selectedSentence.annotation}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-1">Language</h4>
                                <Badge variant="outline">
                                  {selectedSentence.language}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Confidence</h4>
                                <Badge
                                  variant={
                                    selectedSentence.confidence >= 0.9
                                      ? "default"
                                      : selectedSentence.confidence >= 0.7
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {(selectedSentence.confidence * 100).toFixed(
                                    1
                                  )}
                                  %
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Annotator</h4>
                                <p className="text-sm">
                                  {selectedSentence.annotator}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Date</h4>
                                <p className="text-sm">
                                  {selectedSentence.annotationDate}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSentences.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                {searchTerm
                  ? "No annotations match your search."
                  : "No annotated sentences found."}
              </p>
            </div>
          )}
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
