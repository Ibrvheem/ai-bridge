import React from "react";

import { FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import dayjs from "@/lib/dayjs";
import { EmptyState } from "@/components/ui/empty-state";
import { SentenceAnnotator } from "./_components";
import { getUnannotatedSentences } from "./services";
import { SentenceSchema } from "./types";

export default async function SentencesPage() {
  const sentences: SentenceSchema[] = await getUnannotatedSentences();

  // Calculate statistics
  const totalSentences = sentences.length;
  const annotatedCount = sentences.filter((s) => s.bias_category).length;
  const unannotatedCount = totalSentences - annotatedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Sentences</h1>
        <p className="text-sm text-slate-600 mt-1">
          Review and annotate sentences with appropriate bias categories
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-sm font-medium text-slate-600">Annotated</p>
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
      </div>

      {/* Sentences Table */}
      <div className="rounded-lg border border-slate-200 bg-white">
        {sentences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Sentence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Bias Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {sentences.map((sentence) => (
                  <tr key={sentence._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="text-sm text-slate-900 line-clamp-2">
                          {sentence.sentence}
                        </p>
                        {sentence.original_content && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            Original: {sentence.original_content}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {sentence.language}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sentence.bias_category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {sentence.bias_category}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {sentence.user?.email || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {dayjs(sentence.created_at).fromNow()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <SentenceAnnotator sentence={sentence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </div>
  );
}
