import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Clock, MessageSquare, Layers } from "lucide-react";
import { UploadSentencesModal } from "../_components";
import { getLanguages } from "../../settings/languages/service";
import dayjs from "@/lib/dayjs";
import { EmptyState } from "@/components/ui/empty-state";
import { getUnannotatedSentences } from "../../sentences/services";
import { SentenceSchema } from "../../sentences/types";

export default async function UnannotatedPage() {
  const sentences: SentenceSchema[] = await getUnannotatedSentences();
  const languages = await getLanguages();
  const uniqueLanguages = new Set(
    sentences.map((s) => s.language).filter(Boolean)
  ).size;

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
      <div className=" gap-4 md:grid-cols-4 hidden">
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
            <Badge variant="secondary">{uniqueLanguages}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueLanguages}</div>
            <p className="text-xs text-muted-foreground">Different languages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentences.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready for annotation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uploads</CardTitle>
            <Layers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{languages.length}</div>
            <p className="text-xs text-muted-foreground">Languages available</p>
          </CardContent>
        </Card>
      </div>

      {/* Sentences Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            All Sentences ({sentences.length})
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {sentences.length} pending annotation
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {sentences.length > 0 ? (
            sentences.map((sentence) => (
              <Card
                key={sentence._id}
                className="p-5 hover:shadow-md transition-all duration-200 border-slate-200 group"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-base text-slate-900 leading-relaxed flex-1">
                        {sentence.sentence}
                      </p>
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200 border shrink-0">
                        Pending
                      </Badge>
                    </div>
                    {sentence.original_content && (
                      <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
                        <p className="text-xs font-medium text-slate-600 mb-1">
                          Original Content:
                        </p>
                        <p className="text-sm text-slate-700">
                          {sentence.original_content}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="font-mono text-slate-500">ID:</span>
                        <span>#{sentence._id.slice(-5)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{dayjs(sentence.created_at).fromNow()}</span>
                      </div>
                      {sentence.language && (
                        <Badge variant="outline" className="text-xs">
                          {sentence.language.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {sentence.user?.email}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
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
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground">
          Powered by <span className="font-semibold">Study Labs</span>
        </p>
      </footer>
    </div>
  );
}
