import { Button } from "@/components/ui/button";
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
import { Upload, FileText, Clock, MessageSquare } from "lucide-react";
import { UploadSentencesModal } from "../_components";
import { getLanguages } from "../../settings/languages/service";
import dayjs from "@/lib/dayjs";
import { EmptyState } from "@/components/ui/empty-state";
import { getUnannotatedSentences } from "../../sentences/services";
import { SentenceSchema } from "../../sentences/types";

export default async function UnannotatedPage() {
  const sentences: SentenceSchema[] = await getUnannotatedSentences();
  const languages = await getLanguages();

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

        <UploadSentencesModal languages={languages}>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload New
          </Button>
        </UploadSentencesModal>
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
              {/* {sentences.filter((s) => s.status === "pending").length} */}
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
          {sentences.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Sentence</TableHead>
                  <TableHead>Original Content</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Uploaded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentences.map((sentence) => (
                  <TableRow key={sentence._id}>
                    <TableCell className="font-medium">
                      #{sentence._id.slice(-5)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sentence.language}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {sentence.sentence}
                    </TableCell>
                    <TableCell>{sentence.original_content}</TableCell>
                    <TableCell>
                      {dayjs(sentence.created_at).fromNow()}
                    </TableCell>
                    <TableCell>{sentence.user?.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8">
              <EmptyState
                icon={MessageSquare}
                title="No sentences to annotate"
                description="Upload your first CSV file containing sentences to start the annotation process."
              >
                <UploadSentencesModal languages={languages}>
                  <Button className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Sentences
                  </Button>
                </UploadSentencesModal>
              </EmptyState>
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
