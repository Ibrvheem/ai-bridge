"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Tag } from "lucide-react";
import dayjs from "@/lib/dayjs";

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

type AnnotatedSentenceCardProps = {
  sentence: Sentence;
};

export function AnnotatedSentenceCard({
  sentence,
}: AnnotatedSentenceCardProps) {
  const getBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      GENDER: "bg-purple-100 text-purple-800 border-purple-200",
      RACE_ETHNICITY: "bg-blue-100 text-blue-800 border-blue-200",
      AGE: "bg-green-100 text-green-800 border-green-200",
      DISABILITY: "bg-orange-100 text-orange-800 border-orange-200",
      RELIGION: "bg-pink-100 text-pink-800 border-pink-200",
      NATIONALITY: "bg-indigo-100 text-indigo-800 border-indigo-200",
      SOCIOECONOMIC: "bg-amber-100 text-amber-800 border-amber-200",
      NONE: "bg-slate-100 text-slate-800 border-slate-200",
    };
    return colors[category] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <Card className="p-5 hover:shadow-md transition-shadow border-slate-200">
      <div className="space-y-4">
        {/* Sentence Content */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <p className="text-base text-slate-900 leading-relaxed flex-1">
              {sentence.sentence}
            </p>
            {sentence.bias_category && (
              <Badge
                className={`${getBadgeColor(
                  sentence.bias_category
                )} border shrink-0`}
              >
                <Tag className="h-3 w-3 mr-1" />
                {sentence.bias_category.replace(/_/g, " ")}
              </Badge>
            )}
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

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <User className="h-3.5 w-3.5" />
            <span>Uploaded by: {sentence.user?.email}</span>
          </div>

          {sentence.annotated_by && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <FileText className="h-3.5 w-3.5" />
              <span>
                Annotated by:{" "}
                {typeof sentence.annotated_by === "string"
                  ? sentence.annotated_by
                  : sentence.annotated_by.email}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Calendar className="h-3.5 w-3.5" />
            <span>{dayjs(sentence.updated_at).fromNow()}</span>
          </div>

          {sentence.language && (
            <Badge variant="outline" className="text-xs">
              {sentence.language.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
