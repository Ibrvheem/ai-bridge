import { FileText, AlertCircle, CheckCircle2, Layers } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SentenceCard } from "./_components";
import { getUnannotatedSentences } from "./services";
import { SentenceSchema } from "./types";

export default async function SentencesPage() {
  const sentences: SentenceSchema[] = await getUnannotatedSentences();

  // Calculate statistics
  const totalSentences = sentences.length;
  const annotatedCount = sentences.filter((s) => s.bias_category).length;
  const unannotatedCount = totalSentences - annotatedCount;
  const uniqueLanguages = new Set(
    sentences.map((s) => s.language).filter(Boolean)
  ).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Sentences</h1>
        <p className="text-sm text-slate-600 mt-1">
          Review and annotate sentences with appropriate bias categories
        </p>
      </div>

      {sentences.length > 0 ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Sentences
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {totalSentences}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-slate-700" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Annotated
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {annotatedCount}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Pending Annotation
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {unannotatedCount}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-700" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Languages
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {uniqueLanguages}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Sentences Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                All Sentences ({sentences.length})
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {unannotatedCount} pending annotation
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {sentences.map((sentence) => (
                <SentenceCard key={sentence._id} sentence={sentence} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={FileText}
          title="No sentences found"
          description="Upload sentences from the annotations page to get started."
          action={{
            label: "Go to Annotations",
            href: "/annotations",
          }}
        />
      )}
    </div>
  );
}
