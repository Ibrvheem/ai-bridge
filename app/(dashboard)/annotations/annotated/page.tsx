import { CheckCircle2, FileText, Tag, TrendingUp } from "lucide-react";
import { getAnnotatedSentences } from "../../sentences/services";
import { AnnotatedSentenceCard } from "./_components";
import { EmptyState } from "@/components/ui/empty-state";

type Sentence = {
  _id: string;
  sentence: string;
  original_content?: string;
  bias_category?: string;
  language?: string;
  document_id?: string;
  user?: {
    _id: string;
    email: string;
  };
  annotated_by?:
    | {
        _id: string;
        email: string;
      }
    | string;
  created_at: string;
  updated_at: string;
};

export default async function AnnotatedSentencesPage() {
  const sentences: Sentence[] = await getAnnotatedSentences();

  // Calculate statistics
  const totalSentences = sentences.length;
  const uniqueCategories = new Set(
    sentences.map((s) => s.bias_category).filter(Boolean)
  ).size;
  const uniqueAnnotators = new Set(
    sentences
      .map((s) =>
        typeof s.annotated_by === "string"
          ? s.annotated_by
          : s.annotated_by?._id
      )
      .filter(Boolean)
  ).size;

  // Category distribution
  const categoryDistribution = sentences.reduce((acc, s) => {
    if (s.bias_category) {
      acc[s.bias_category] = (acc[s.bias_category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Annotated Sentences
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review all sentences that have been annotated with bias categories
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
                    Total Annotated
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {totalSentences}
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
                    Categories Used
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {uniqueCategories}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-purple-700" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Annotators
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {uniqueAnnotators}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Top Category
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mt-1 truncate">
                    {Object.entries(categoryDistribution)
                      .sort((a, b) => b[1] - a[1])[0]?.[0]
                      ?.replace(/_/g, " ") || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {Object.entries(categoryDistribution).sort(
                      (a, b) => b[1] - a[1]
                    )[0]?.[1] || 0}{" "}
                    sentences
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          {Object.keys(categoryDistribution).length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
                Category Distribution
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.entries(categoryDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div
                      key={category}
                      className="text-center p-3 rounded-md bg-slate-50 border border-slate-200"
                    >
                      <p className="text-xs font-medium text-slate-600 mb-1">
                        {category.replace(/_/g, " ")}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {count}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Sentences Grid */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              All Annotated Sentences
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {sentences.map((sentence) => (
                <AnnotatedSentenceCard key={sentence._id} sentence={sentence} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={FileText}
          title="No annotated sentences yet"
          description="Start annotating sentences from the unannotated sentences page."
          action={{
            label: "Go to Sentences",
            href: "/sentences",
          }}
        />
      )}
    </div>
  );
}
