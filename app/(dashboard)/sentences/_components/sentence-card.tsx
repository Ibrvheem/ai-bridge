"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Edit3, FileText } from "lucide-react";
import dayjs from "@/lib/dayjs";
import { useState } from "react";
import { AnnotateSentenceModal } from "./annotate-sentence-modal";
import type { DataCollection, AnnotatedData, BiasLabel } from "../types";

type SentenceCardProps = {
  sentence: DataCollection | AnnotatedData;
};

export function SentenceCard({ sentence }: SentenceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAnnotated = "bias_label" in sentence && sentence.bias_label !== null;

  const getBiasLabelColor = (label: BiasLabel) => {
    const colors: Record<BiasLabel, string> = {
      stereotype: "bg-red-100 text-red-800 border-red-200",
      "counter-stereotype": "bg-green-100 text-green-800 border-green-200",
      neutral: "bg-slate-100 text-slate-800 border-slate-200",
      derogation: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[label];
  };

  const formatLabel = (label: string) => {
    return label
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Card className="p-5 hover:shadow-md transition-all duration-200 border-slate-200 group">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <p className="text-base text-slate-900 leading-relaxed flex-1">
                {sentence.text}
              </p>
              <div className="flex gap-2 shrink-0">
                {isAnnotated && (sentence as AnnotatedData).bias_label && (
                  <Badge
                    className={`${getBiasLabelColor(
                      (sentence as AnnotatedData).bias_label,
                    )} border`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {formatLabel((sentence as AnnotatedData).bias_label)}
                  </Badge>
                )}
                {!isAnnotated && (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 border">
                    Pending
                  </Badge>
                )}
              </div>
            </div>

            {isAnnotated && (
              <div className="rounded-md bg-slate-50 border border-slate-200 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-700">
                  Annotation Details:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(sentence as AnnotatedData).target_gender && (
                    <div>
                      <span className="font-medium text-slate-600">
                        Target Gender:
                      </span>{" "}
                      {formatLabel((sentence as AnnotatedData).target_gender)}
                    </div>
                  )}
                  {(sentence as AnnotatedData).explicitness && (
                    <div>
                      <span className="font-medium text-slate-600">
                        Explicitness:
                      </span>{" "}
                      {formatLabel((sentence as AnnotatedData).explicitness)}
                    </div>
                  )}
                  {(sentence as AnnotatedData).stereotype_category && (
                    <div>
                      <span className="font-medium text-slate-600">
                        Category:
                      </span>{" "}
                      {formatLabel(
                        (sentence as AnnotatedData).stereotype_category,
                      )}
                    </div>
                  )}
                  {(sentence as AnnotatedData).sentiment_toward_referent && (
                    <div>
                      <span className="font-medium text-slate-600">
                        Sentiment:
                      </span>{" "}
                      {formatLabel(
                        (sentence as AnnotatedData).sentiment_toward_referent,
                      )}
                    </div>
                  )}
                  {(sentence as AnnotatedData).device && (
                    <div>
                      <span className="font-medium text-slate-600">
                        Device:
                      </span>{" "}
                      {formatLabel((sentence as AnnotatedData).device)}
                    </div>
                  )}
                  {(sentence as AnnotatedData).qa_status && (
                    <div>
                      <span className="font-medium text-slate-600">
                        QA Status:
                      </span>{" "}
                      {formatLabel((sentence as AnnotatedData).qa_status)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <FileText className="h-3.5 w-3.5" />
                <span>{sentence.language.toUpperCase()}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Calendar className="h-3.5 w-3.5" />
                <span>{dayjs(sentence.created_at).fromNow()}</span>
              </div>

              {sentence.domain && (
                <Badge variant="outline" className="text-xs">
                  {formatLabel(sentence.domain)}
                </Badge>
              )}

              {sentence.theme && (
                <Badge variant="outline" className="text-xs">
                  {formatLabel(sentence.theme)}
                </Badge>
              )}
            </div>

            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              {isAnnotated ? "Edit" : "Annotate"}
            </Button>
          </div>
        </div>
      </Card>

      <AnnotateSentenceModal
        sentence={sentence as DataCollection}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
